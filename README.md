# IoT Backoffice Service

This repository contains the backend service for the IoT Backoffice application. It uses Node.js (Nest.js) for the backend framework and MongoDB as the database. The application is containerized using Docker for ease of deployment.

## Repository

- **Repository Name**: IoT Backoffice Service
- **Repository URL**: [IoT Backoffice Service](https://github.com/topspinppy/iot-bof-web)

## Technologies Used

- **Node.js (Nest.js)**: The backend framework used to build the application.
- **MongoDB**: The database used for storing application data.

## Running the Program

To run this application using Docker, follow these steps:

1. **Clone the Repository**:
    ```sh
    git clone https://github.com/topspinppy/iot-bof-web
    cd iot-bof-web
    ```

2. **Build the Docker Containers**:
    ```sh
    docker-compose build
    ```

3. **Run the Docker Containers in Detached Mode**:
    ```sh
    docker-compose up -d
    ```

4. **Verify the Containers are Running**:
    You can check the status of the containers using:
    ```sh
    docker-compose ps
    ```

By following these steps, you will have the IoT Backoffice Service running in Docker containers.

## Additional Notes

- Ensure that Docker and Docker Compose are installed on your system before running the commands.
- If you encounter any issues, please refer to the [Docker Documentation](https://docs.docker.com/) for troubleshooting tips.

For any further assistance or queries, feel free to open an issue in the repository. Happy coding!