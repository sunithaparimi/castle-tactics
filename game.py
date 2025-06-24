from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_mysqldb import MySQL
from flask_wtf import FlaskForm  
from wtforms import StringField, PasswordField, validators, SubmitField, SelectField
from wtforms.validators import ValidationError, EqualTo, Length, DataRequired
import bcrypt
import MySQLdb
import MySQLdb.cursors
from middleware import NoCacheMiddleware
from functools import wraps
from flask import abort
import logging
from flask_cors import CORS
logging.basicConfig(level=logging.DEBUG)
import firebase_admin
from firebase_admin import credentials, messaging, initialize_app
from datetime import datetime
from flask_socketio import SocketIO, emit, join_room
from dotenv import load_dotenv
import os
import pymysql
pymysql.install_as_MySQLdb()


load_dotenv()
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
app.secret_key = 'your_secret_key'
cred = credentials.Certificate(r'C:\Users\suhia\OneDrive\Desktop\chess dbis minor proj\castle-tactics-75ea9-firebase-adminsdk-uy0le-cdeec9fc32.json')

firebase_admin.initialize_app(cred)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 's6u2h5i'
app.config['MYSQL_DB'] = 'castle_tactics'

mysql = MySQL(app)
app.wsgi_app= NoCacheMiddleware(app.wsgi_app)

def validate_user_id(form, field):
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT * FROM USER_DETAILS WHERE user_name=%s", (field.data,))
    user = cursor.fetchone()
    cursor.close()
    if user:
        raise ValidationError('User Name already exists')

class RegistrationForm(FlaskForm): 
    user_name = StringField('user_name', [Length(min=4, max=50), validate_user_id])
    email_ID = StringField('email_id', [Length(min=10, max=50)])  # Adjust max length if needed
    password = PasswordField('Password', [Length(min=6, max=100)])
    confirm_password = PasswordField('Confirm Password', 
                                     [Length(min=6, max=100), 
                                      EqualTo('password', message='Passwords do not match. Please try again.')])
    notification_status = SelectField("Notification Status", choices=[
        ('1', 'Yes'),
        ('0', 'No'),
    ], validators=[DataRequired()])
    submit = SubmitField('Register')

class LoginForm(FlaskForm): 
    user_name = StringField('user_name', [validators.Length(min=4, max=50)])
    password = PasswordField('Password', [validators.Length(min=6, max=100)])
    submit = SubmitField('Login')  
  
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_name' not in session:
            return redirect(url_for('login'))  # Redirect to login if not logged in
        return f(*args, **kwargs)
    return decorated_function


@app.route('/')
def home2():
    user_name = session.get('user_name')
    email_id = session.get('email_id')
    notification_status = session.get('notification_status')
    is_notifications_on = notification_status == b'\x01'

    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT email_id, notification_status FROM USER_DETAILS WHERE user_name=%s", (user_name,))
    user = cursor.fetchone()

    if user:
        return render_template('home2.html', user_name = user_name, email_id = email_id, is_notifications_on = is_notifications_on)

    return render_template('home2.html')

@app.route('/start')
@login_required
def start():
    user_name = session.get('user_name')
    email_id = session.get('email_id')
    notification_status = session.get('notification_status')
    is_notifications_on = notification_status == b'\x01'


    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT email_id, notification_status FROM USER_DETAILS WHERE user_name=%s", (user_name,))
    user = cursor.fetchone()

    if user:
        return render_template('start.html', user_name = user_name, email_id = email_id, is_notifications_on = is_notifications_on)

    return render_template('start.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm(request.form)
    if form.validate_on_submit(): 
        user_name = form.user_name.data
        password = form.password.data  

        cursor = mysql.connection.cursor()
        cursor.execute("SELECT password, email_id, notification_status FROM USER_DETAILS WHERE user_name = %s", (user_name,))
        user = cursor.fetchone()
        
        if user and bcrypt.checkpw(password.encode('utf-8'), user[0].encode('utf-8')):  
            # Store user information in the session
            session['user_name'] = user_name
            session['email_id'] = user[1]  # Store the email_id from the database
            session['notification_status'] = user[2]  # Store the notification status

            cursor.execute("UPDATE USER_DETAILS SET availability = 1 WHERE user_name = %s", (user_name,))
            mysql.connection.commit()

            flash(f'Login successful for User Name: {user_name}')
            return redirect(url_for('home2'))
        else:
            flash('Invalid User Name or Password')
    
    return render_template('login.html', form=form)


@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm(request.form)
    if form.validate_on_submit():
        user_name = form.user_name.data
        email_id = form.email_ID.data
        notification_status = int(form.notification_status.data)
        password = form.password.data
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        cursor = mysql.connection.cursor()
        
        try:
            cursor.execute(
                "INSERT INTO USER_DETAILS (user_name, email_id, notification_status, password) VALUES (%s, %s, %s, %s)",
                (user_name, email_id, notification_status, hashed_password)
            )
            mysql.connection.commit()

            # Create user stats
            # Create user stats
            cursor.execute("INSERT INTO USER_STATS (user_name, coins, no_of_games_played, no_of_lost, no_of_won, no_of_drawn) VALUES (%s, %s, %s, %s, %s, %s)", (user_name,300 , 0, 0, 0, 0))
            mysql.connection.commit()

            flash('Registration successful!')
            return redirect(url_for('login'))  # Or return the duringgame page here if you want direct redirection

        except Exception as e:
            mysql.connection.rollback()
            flash(f'Error during registration: {str(e)}')
        finally:
            cursor.close()

    return render_template('register.html', form=form)


@app.route('/register_with_invite', methods=['POST'])
def register_with_invite():
    cursor = None
    try:
        # Get the JSON data from the AJAX request
        data = request.get_json()

        # Extract form data
        user_name = data.get('user_name')
        email_id = data.get('email_id')
        password = data.get('password')
        notification_status = int(data.get('notification_status', 1))
        selected_friends = data.get('selected_friends', [])

        # Validate the form data
        if not user_name or not email_id or not password:
            return jsonify({'status': 'error', 'message': 'Missing required fields.'})

        # Hash the password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Database insertion logic
        cursor = mysql.connection.cursor()  # Initialize cursor here
        cursor.execute(
            "INSERT INTO USER_DETAILS (user_name, email_id, notification_status, password) VALUES (%s, %s, %s, %s)",
            (user_name, email_id, notification_status, hashed_password)
        )
        mysql.connection.commit()

        # Insert user stats (e.g., initial coins)
        initial_coins = 300
        cursor.execute("INSERT INTO USER_STATS (user_name, coins) VALUES (%s, %s)", (user_name, initial_coins))
        mysql.connection.commit()

        # Get logged-in user from session
        logged_in_user_name = session.get('user_name')

        return jsonify({
            'status': 'success',
            'new_user': user_name,
            'logged_in_user': logged_in_user_name,
            'redirect': True
        })

    except Exception as e:
        mysql.connection.rollback()  # Rollback the transaction on error
        return jsonify({'status': 'error', 'message': str(e)})

    finally:
        if cursor:  # Ensure cursor is always closed if it was initialized
            cursor.close()




@app.route('/get_friends', methods=['GET'])
@login_required
def get_friends():
    current_user = session.get('user_name')  # Fetching the logged-in user's username from session
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    
    try:
        # Query to fetch all users except the current user
        cursor.execute("SELECT user_name FROM USER_DETAILS WHERE user_name != %s", (current_user,))
        friends = cursor.fetchall()
        
        # Return the list of friends as JSON
        return jsonify({'friends': [{'user_name': friend['user_name']} for friend in friends]})

    except Exception as e:
        print(f"Error fetching friends: {e}")
        return jsonify({'error': 'Failed to fetch friends'}), 500
    finally:
        cursor.close()



@app.route('/invite_friend', methods=['POST'])
def invite_friend():
    try:
        # Get the JSON data from the request
        data = request.get_json()

        if not data:
            print("No data received in the request!")
            return jsonify({'success': False, 'message': 'No data received'}), 400

        # Extract data from the JSON object
        invited_user = data.get('invited_user')
        password = data.get('password')
        current_user = data.get('current_user')

        # Log received data
        print(f"Received invite request:")
        print(f"Current user: {current_user}, Invited user: {invited_user}, Entered password: {password}")

        # Ensure we received all necessary data
        if not current_user or not invited_user or not password:
            print("Missing required data in the request!")
            return jsonify({'success': False, 'message': 'Missing required data'}), 400

        cursor = mysql.connection.cursor()

        # Fetch the hashed password for the invited user from the DB
        cursor.execute("SELECT password FROM USER_DETAILS WHERE user_name = %s", (invited_user,))
        result = cursor.fetchone()

        # Log the query result for debugging
        print(f"Query result: {result}")

        if result:
            # Log the stored password hash
            print(f"Stored password hash for invited user: {result[0]}")

            # Clean up the entered password (strip any unwanted whitespace)
            entered_password = password.strip()

            # Compare entered password with stored hashed password using bcrypt
            if bcrypt.checkpw(entered_password.encode('utf-8'), result[0].encode('utf-8')):
                print(f"Password match successful for invited user: {invited_user}")

                # Send the success response to the frontend
                return jsonify({
                    'success': True,
                    'player1': current_user,
                    'player2': invited_user
                })
            else:
                print("Password does not match.")
                return jsonify({'success': False, 'message': 'Incorrect password'}), 401
        else:
            print("Invited user not found.")
            return jsonify({'success': False, 'message': 'User not found'}), 404

    except Exception as e:
        # Log the full error message
        print(f"Error during invite: {str(e)}")
        return jsonify({'success': False, 'message': f'Error during invite: {str(e)}'}), 500

    finally:
        cursor.close()


@app.route('/send_invitation', methods=['POST'])
def send_invitation():
    friend_username = request.form.get('friend_username')
    current_user = session.get('user_name')

    if not friend_username:
        return jsonify({"status": "error", "message": "Friend username is missing."}), 400

    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT user_name FROM USER_DETAILS WHERE user_name = %s", (friend_username,))
    friend = cursor.fetchone()

    if friend:
        try:
            cursor.execute("""
                INSERT INTO FRIEND_INVITATIONS (sender_user_name, receiver_user_name, status) 
                VALUES (%s, %s, 'pending')
            """, (current_user, friend_username))
            mysql.connection.commit()

            # Emit real-time notification to the invited user
            socketio.emit('invitation_received', {
                "sender": current_user,
                "message": "You have received a game invitation!"
            }, room=friend_username)  # Emit to the invitee's session ID

            return jsonify({"status": "success", "message": "Invitation sent successfully."}), 200
        except Exception as e:
            mysql.connection.rollback()
            return jsonify({"status": "error", "message": f"Database error: {str(e)}"}), 500
        finally:
            cursor.close()
    else:
        return jsonify({"status": "error", "message": "Friend not found."}), 404

# Global dictionary to store user-to-session mappings (connected users)
user_sessions = {}

# Function to get the session ID (SID) of a user
def get_socket_room_for_user(username):
    return user_sessions.get(username)  # Return the inviter's session ID (if mapped)

@socketio.on('connect')
def handle_connect():
    user_name = session.get('user_name')
    sid = request.sid  # WebSocket session ID
    print(f"[WebSocket] User connected: {user_name}, SID: {sid}")

    if user_name:
        user_sessions[user_name] = sid
        print(f"[WebSocket] Active sessions: {user_sessions}")
    else:
        print("[WebSocket] Warning: User connected without a valid username.")

@socketio.on('disconnect')
def handle_disconnect():
    sid = request.sid
    disconnected_user = None
    for user, user_sid in user_sessions.items():
        if user_sid == sid:
            disconnected_user = user
            break
    if disconnected_user:
        del user_sessions[disconnected_user]
        print(f"[WebSocket] User disconnected: {disconnected_user}, SID: {sid}")
    else:
        print(f"[WebSocket] Unknown disconnection: SID={sid}")

@socketio.on('send_invite')
def handle_send_invite(data):
    try:
        print(f"[WebSocket] send_invite received: {data}")

        inviter = data.get('inviter')
        invitee = data.get('invitee')
        game_mode = data.get('gameMode', 'online')

        if not inviter or not invitee:
            print("[WebSocket] Missing inviter or invitee.")
            return

        invitee_sid = user_sessions.get(invitee)

        if invitee_sid:
            print(f"[WebSocket] Sending invitation_received to {invitee}")
            socketio.emit('invitation_received', {
                'sender': inviter,
                'message': 'You have been invited to play chess!',
                'gameMode': game_mode
            }, room=invitee_sid)
        else:
            print(f"[WebSocket] Invitee {invitee} is not connected.")
    except Exception as e:
        print(f"[WebSocket] Error in send_invite: {str(e)}")

# Handling accepting an invitation
@socketio.on('accept_invite')
def handle_accept_invite(data):
    inviter = data.get('inviter')
    invitee = data.get('invitee')

    if not inviter or not invitee:
        print("Error: Missing inviter or invitee in data.")
        return

    # Ensure both users exist in the database (assuming MySQL is being used)
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT user_name FROM USER_DETAILS WHERE user_name IN (%s, %s)", (inviter, invitee))
    users = cursor.fetchall()
    if len(users) < 2:
        print(f"Error: One or both users ({inviter}, {invitee}) do not exist.")
        return

    # Notify the inviter to redirect to the game page (using session ID)
    inviter_sid = get_socket_room_for_user(inviter)
    if inviter_sid:
        # Notify both the inviter and invitee to start the game (via 'invitation_accepted')
        socketio.emit('invitation_accepted', {
            'player1': inviter,
            'player2': invitee,
            'mode': 'online'  # Send game mode to both users
        }, room=inviter_sid)  # Send to the inviter's session ID
        
        # You can also send a notification to the invitee if needed
        invitee_sid = get_socket_room_for_user(invitee)
        if invitee_sid:
            socketio.emit('invitation_accepted', {
                'player1': inviter,
                'player2': invitee,
                'mode': 'online'  # Send game mode to both users
            }, room=invitee_sid)  # Send to the invitee's session ID
    else:
        print(f"Error: Could not find socket room for inviter {inviter}")

   
@app.route('/update_notification_status', methods=['GET'])
def update_notification_status():
    if 'user_name' in session:
        user_name = session['user_name']
        cursor = mysql.connection.cursor()
        
        cursor.execute("SELECT notification_status FROM USER_DETAILS WHERE user_name = %s", (user_name,))
        current_status = cursor.fetchone()[0]

       
        new_status = b'\x00' if current_status == b'\x01' else b'\x01'
        
       
        cursor.execute("UPDATE USER_DETAILS SET notification_status = %s WHERE user_name = %s", (new_status, user_name))
        mysql.connection.commit()
        
        
        session['notification_status'] = new_status
        
        
        next_url = request.args.get('next', url_for('home2'))  
        return redirect(next_url)
    
    return jsonify(success=False), 403


@app.route('/logout') 
def logout():
    if 'user_name' in session:
        user_name = session['user_name']
        
        cursor = mysql.connection.cursor()
        
        # Update availability to 0 (logged out)
        cursor.execute("UPDATE USER_DETAILS SET availability = 0 WHERE user_name = %s", (user_name,))
        mysql.connection.commit()
        
        # Remove user information from the session
        session.pop('user_name', None)
        session.pop('email_id', None)
        session.pop('notification_status', None)  

    return redirect(url_for('home2'))

@app.route('/about')
def about():
    user_name = session.get('user_name')
    email_id = session.get('email_id')
    notification_status = session.get('notification_status')
    is_notifications_on = notification_status == b'\x01'

    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT email_id, notification_status FROM USER_DETAILS WHERE user_name=%s", (user_name,))
    user = cursor.fetchone()

    if user:
        return render_template('about.html', user_name = user_name, email_id = email_id, is_notifications_on = is_notifications_on)

    return render_template('about.html')

@app.route('/leaderboard')
@login_required
def leaderboard():
    user_name = session.get('user_name')
    email_id = session.get('email_id')
    notification_status = session.get('notification_status')
    is_notifications_on = notification_status == 1  # Assuming notification_status is stored as integer (1 or 0)

    # Fetch user details for the session user
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT email_id, notification_status FROM USER_DETAILS WHERE user_name=%s", (user_name,))
    user = cursor.fetchone()

    # Check if user exists
    if not user:
        # If user is not found, redirect to login
        return redirect(url_for('login'))

    # Updated SQL query to fetch leaderboard data with the correct rank calculation and field names
    query = """
    SELECT 
        u.user_name, 
        AVG(COALESCE(p.score, 0)) AS avg_score,  -- Handle NULL scores as 0
        CASE 
            WHEN u.no_of_games_played > 0 THEN (u.no_of_won / u.no_of_games_played) * 100 
            ELSE 0 
        END AS win_percentage, 
        u.coins,
        COALESCE(u.user_rank, 'Unranked') AS user_rank  -- Handle NULL rank values and assign a default 'Unranked' value
    FROM 
        USER_STATS u
    LEFT JOIN 
        PREVIOUSLY_PLAYED p ON u.user_name = p.user_name
    GROUP BY 
        u.user_name, u.no_of_games_played, u.no_of_won, u.coins, u.user_rank
    ORDER BY 
        avg_score DESC, win_percentage DESC, coins DESC
    LIMIT 10;
    """
    cursor.execute(query)
    leaderboard_data = cursor.fetchall()

    return render_template('leaderboard.html', 
                           user_name=user_name, 
                           email_id=email_id, 
                           is_notifications_on=is_notifications_on, 
                           leaderboard_data=leaderboard_data)

@app.route('/userstats')
@login_required
def userstats():
    user_name = session.get('user_name')
    email_id = session.get('email_id')
    notification_status = session.get('notification_status')
    is_notifications_on = notification_status == b'\x01'  # Convert notification status to boolean

    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

    # Fetch user details (email, notification status) from the USER_DETAILS table
    cursor.execute("SELECT email_id, notification_status FROM USER_DETAILS WHERE user_name=%s", (user_name,))
    user = cursor.fetchone()

    if user:
        # Query for the games the user has played (white or black) with scores, positions, start and end time
        cursor.execute("""
        SELECT DISTINCT
            gd.game_id, 
            pp.score, 
            pp.user_position AS position,
            gd.end_time,
            dt.start_time 
        FROM 
            GAME_DETAILS gd
        JOIN 
            PREVIOUSLY_PLAYED pp 
            ON gd.game_id = pp.game_id
        JOIN 
            DETAILS_TRANSFER dt 
            ON gd.game_id = dt.game_id
        WHERE 
            pp.user_name = %s
        ORDER BY 
            gd.end_time DESC
        """, (user_name,))

        games = cursor.fetchall()  # Fetch all games the user played

        # Close the cursor after fetching the data
        cursor.close()

        # Add time played calculation for each game
        for game in games:
            # Get the start and end times
            start_time = game.get('start_time')
            end_time = game.get('end_time')

            # Check if both start_time and end_time are valid datetime objects
            if start_time and end_time:
                # Calculate the time difference (end_time - start_time)
                time_played = end_time - start_time

                # Convert the time played to total seconds
                total_seconds = time_played.total_seconds()

                # Optionally, convert to minutes or hours
                minutes_played = total_seconds / 60  # in minutes
                hours_played = total_seconds / 3600  # in hours

                # Round the time played as per your requirement (e.g., 2 decimal places)
                game['time_played'] = round(minutes_played, 2)  # time in minutes, rounded to 2 decimals
            else:
                # Handle the case when either start_time or end_time is None
                game['time_played'] = None  # or some default value, e.g., 'Data not available'

        # Pass the user details and games data to the template
        return render_template(
            'userstats.html', 
            user_name=user_name, 
            email_id=email_id, 
            is_notifications_on=is_notifications_on,
            games=games
        )

    # If user data is not found, return the template with no game data
    return render_template('userstats.html')

@app.route('/learn')
@login_required
def learn():
    user_name = session.get('user_name')
    email_id = session.get('email_id')
    notification_status = session.get('notification_status')
    is_notifications_on = notification_status == b'\x01'

    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT email_id, notification_status FROM USER_DETAILS WHERE user_name=%s", (user_name, ))
    user = cursor.fetchone()

    if user:
        return render_template('learn.html', user_name = user_name, email_id = email_id, is_notifications_on = is_notifications_on)

    return render_template('learn.html')

@app.route('/set_game_mode', methods=['POST'])
def set_game_mode():
    # Get the mode from the JSON request body
    data = request.get_json()
    mode = data.get('mode', 'offline')  # Default to 'offline' if mode is not provided

    # Optionally, store the mode in session or perform logic based on the mode
    session['game_mode'] = mode  # Store the mode in the session (if needed)

    # You can perform further actions here, for example, send a response or redirect
    if mode == 'online':
        return jsonify({"status": "success", "message": "Game mode set to online"})
    else:
        return jsonify({"status": "success", "message": "Game mode set to offline"})

@app.route('/duringgame')
@login_required
def duringgame():
    user_name = session.get('user_name')
    email_id = session.get('email_id')
    notification_status = session.get('notification_status')
    is_notifications_on = notification_status == b'\x01'

    # Get the game mode from the query parameter (fallback to session or default to 'offline')
    game_mode = request.args.get('mode') or session.get('game_mode', 'offline')

    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    
    # Get user details
    cursor.execute("SELECT email_id, notification_status FROM USER_DETAILS WHERE user_name=%s", (user_name,))
    user_details = cursor.fetchone()
    
    # Get coins
    cursor.execute("SELECT coins FROM USER_STATS WHERE user_name=%s", (user_name,))
    coins_data = cursor.fetchone()

    # Check if we got the coins data
    coins = coins_data['coins'] if coins_data else None

    # Set availability to 0 (engaged in game)
    cursor.execute("UPDATE USER_DETAILS SET availability = 0 WHERE user_name = %s", (user_name,))
    mysql.connection.commit()
    
    # Retrieve updated user info if needed
    cursor.execute("SELECT email_id, notification_status FROM USER_DETAILS WHERE user_name=%s", (user_name,))
    user = cursor.fetchone()

    # Get player1 and player2 from URL parameters
    player1 = request.args.get('player1')
    player2 = request.args.get('player2')

    # If the mode is online, validate players and render the online game
    if game_mode == 'online':
        if not player1 or not player2:
            return "Invalid players for online mode.", 400

        # Ensure the current session user matches one of the players
        if user_name not in [player1, player2]:
            return "Access Denied: You are not a participant in this game.", 403

        return render_template('duringgame.html', 
                               user_name=user_name, 
                               email_id=email_id, 
                               is_notifications_on=is_notifications_on, 
                               coins=coins, 
                               player1=player1, 
                               player2=player2, 
                               game_mode=game_mode)  # Pass game mode for template context

    # Default behavior for other modes (e.g., offline or single-player mode)
    return render_template('duringgame.html', 
                           user_name=user_name, 
                           email_id=email_id, 
                           is_notifications_on=is_notifications_on, 
                           coins=coins, 
                           game_mode=game_mode)

@app.route('/submit_score', methods=['POST'])
def submit_score():
    try:
        # Get data from the frontend (request JSON)
        data = request.json
        print("Received data:", data)  # Log the received data

        if not data:
            return jsonify({"status": "error", "message": "No data received"}), 400

        # Extract variables from the received data
        game_id = data.get('gameId')
        player1 = data.get('whiteUserName')
        player2 = data.get('blackUserName')
        score1 = data.get('whiteScore')
        score2 = data.get('blackScore')
        start_time = data.get('startTime')
        end_time = data.get('endTime')
        position1 = data.get('userPositionWhite')
        position2 = data.get('userPositionBlack')
        mode = data.get('gameMode')  # Optional: mode of the game ('computer' or 'two-player')

        # Log the extracted variables
        print(f"Extracted values: game_id={game_id}, player1={player1}, player2={player2}, "
              f"score1={score1}, score2={score2}, start_time={start_time}, end_time={end_time}, "
              f"position1={position1}, position2={position2}, mode={mode}")

        # Validate the required data
        if not game_id or not player1 or score1 is None or start_time is None or end_time is None or position1 is None:
            print("Missing required data")  # Log if any required data is missing
            return jsonify({"status": "error", "message": "Missing required data"}), 400

        # Handle computer mode
        if mode == 'computer':
            print("Game mode is 'computer'. Setting player2, score2, and position2 to None.")
            player2 = None
            score2 = None
            position2 = None
        elif not player2 or score2 is None or position2 is None:
            print(f"Missing required data for player2 in two-player mode. player2={player2}, score2={score2}, position2={position2}")  # Log missing player2 data
            return jsonify({"status": "error", "message": "Missing required data for player2"}), 400

        # If two-player mode, calculate position2 if missing
        if mode == 'two-player' and position2 is None:
            position2 = 1 if score2 > score1 else 0
            print(f"Calculated position2 for player2={player2}: {position2}")  # Log position2 calculation

        # Start a database transaction
        cursor = mysql.connection.cursor()
        cursor.execute("START TRANSACTION;")
        print("Transaction started.")

        # 1. Insert or update game details
        cursor.execute("""
            INSERT INTO GAME_DETAILS (game_id, end_time)
            VALUES (%s, %s)
            ON DUPLICATE KEY UPDATE end_time = VALUES(end_time)
        """, (game_id, end_time))
        print(f"Game details inserted/updated for game_id={game_id} with end_time={end_time}")

        # 2. Insert into DETAILS_TRANSFER for both players
        cursor.execute("""
            INSERT INTO DETAILS_TRANSFER (user_name, game_id, start_time)
            VALUES (%s, %s, %s)
        """, (player1, game_id, start_time))
        print(f"Details transferred for player1={player1} in game_id={game_id} at start_time={start_time}")
        if player2:
            cursor.execute("""
                INSERT INTO DETAILS_TRANSFER (user_name, game_id, start_time)
                VALUES (%s, %s, %s)
            """, (player2, game_id, start_time))
            print(f"Details transferred for player2={player2} in game_id={game_id} at start_time={start_time}")

        # 3. Insert into PREVIOUSLY_PLAYED table with scores and positions
        cursor.execute("""
            INSERT INTO PREVIOUSLY_PLAYED (game_id, user_name, score, user_position)
            VALUES (%s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE score = score + VALUES(score)
        """, (game_id, player1, score1, position1))
        print(f"Inserted score and position for player1={player1} in game_id={game_id}")

        if player2:
            cursor.execute("""
                INSERT INTO PREVIOUSLY_PLAYED (game_id, user_name, score, user_position)
                VALUES (%s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE score = score + VALUES(score)
            """, (game_id, player2, score2, position2))
            print(f"Inserted score and position for player2={player2} in game_id={game_id}")

        # 4. Check if user exists in USER_STATS and insert or update accordingly
        def upsert_user_stats(player, position):
            cursor.execute("SELECT no_of_games_played, no_of_won, no_of_lost, no_of_drawn FROM USER_STATS WHERE user_name = %s", (player,))
            user_stats = cursor.fetchone()

            if user_stats:
                no_of_games_played, no_of_won, no_of_lost, no_of_drawn = user_stats
                no_of_won = no_of_won if no_of_won is not None else 0
                no_of_lost = no_of_lost if no_of_lost is not None else 0
                no_of_drawn = no_of_drawn if no_of_drawn is not None else 0

                cursor.execute("""
                    UPDATE USER_STATS
                    SET no_of_games_played = no_of_games_played + 1,
                        no_of_won = CASE WHEN %s = 1 THEN no_of_won + 1 ELSE no_of_won END,
                        no_of_lost = CASE WHEN %s = 0 THEN no_of_lost + 1 ELSE no_of_lost END,
                        no_of_drawn = CASE WHEN %s = 0.5 THEN no_of_drawn + 1 ELSE no_of_drawn END
                    WHERE user_name = %s;
                """, (position, position, position, player))
                print(f"User stats updated for {player}")
            else:
                cursor.execute("""
                    INSERT INTO USER_STATS (user_name, no_of_games_played, no_of_won, no_of_lost, no_of_drawn, coins)
                    VALUES (%s, 1, CASE WHEN %s = 1 THEN 1 ELSE 0 END, CASE WHEN %s = 0 THEN 1 ELSE 0 END, CASE WHEN %s = 0.5 THEN 1 ELSE 0 END, 0)
                """, (player, position, position, position))
                print(f"User stats inserted for {player}")

        upsert_user_stats(player1, position1)
        if player2:
            upsert_user_stats(player2, position2)

        # 5. Determine the game result and award coins based on the scores
        result1 = 'win' if score1 > score2 else 'lose' if score1 < score2 else 'draw'
        result2 = 'win' if score2 > score1 else 'lose' if score2 < score1 else 'draw'

        # Call the stored procedure to award coins based on game result
        cursor.callproc('update_game_result', [player1, player2, result1])
        cursor.callproc('update_game_result', [player2, player1, result2])
        print(f"Coins awarded for player1={player1} with result {result1}, player2={player2} with result {result2}")

        # Commit the transaction
        mysql.connection.commit()
        print("Transaction committed successfully.")
        cursor.close()

        return jsonify({"status": "success"}), 200

    except Exception as e:
        mysql.connection.rollback()
        print(f"Error during transaction: {str(e)}")  # Log the error message
        return jsonify({"status": "error", "message": f"Error: {str(e)}"}), 500


@app.route('/purchase_hints', methods=['POST'])
def purchase_hints():
    # Get JSON data from the request
    data = request.get_json()
    username = data.get('userName')

    if not username:
        return jsonify({"status": "error", "message": "Username is required"}), 400

    # Get the MySQL connection
    conn = mysql.connection
    cursor = conn.cursor()

    # Query to get the user's current coin balance
    cursor.execute("SELECT coins FROM USER_STATS WHERE user_name = %s", (username,))
    user = cursor.fetchone()

    if user is None:
        return jsonify({"status": "error", "message": "User not found"}), 404

    current_coins = user[0]

    # Logic to check if the user has enough coins (e.g., 10 coins per hint)
    hint_cost = 50
    if current_coins < hint_cost:
        return jsonify({"status": "error", "message": "Not enough coins"}), 400

    # Deduct coins and update the balance in the database
    new_balance = current_coins - hint_cost
    cursor.execute("UPDATE USER_STATS SET coins = %s WHERE user_name = %s", (new_balance, username))
    conn.commit()  # Commit the transaction

    # Close the cursor and connection
    cursor.close()

    # Return success response with new balance
    return jsonify({
        "status": "success",
        "message": "Hints purchased successfully!",
        "newBalance": new_balance
    }), 200



if __name__ == '__main__':
    socketio.run(app, host='127.0.0.1', port=5000, debug=True)
