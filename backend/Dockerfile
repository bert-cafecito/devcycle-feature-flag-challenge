# Backend (FastAPI) Dockerfile
FROM python:3.11-bullseye

# Set the working directory in the container
WORKDIR /backend/

# Copy the backend source code to the container
COPY . /backend

# Install the requirements.txt from the src directory
RUN pip install --no-cache-dir -r /backend/src/requirements.txt

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Run the FastAPI application
CMD ["fastapi", "run", "--workers", "4", "/backend/src/main.py"]