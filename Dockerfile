FROM python:3.11-slim

# Install required system packages
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy all project files
COPY . .

# Upgrade pip and install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN pip install torch==2.3.1+cu118 torchvision==0.18.1+cu118 torchaudio==2.3.1+cu118 \
    -f https://download.pytorch.org/whl/cu118/torch_stable.html


# Run the app (update with your actual app entry point)
CMD ["gunicorn", "game:app", "--bind", "0.0.0.0:10000"]
