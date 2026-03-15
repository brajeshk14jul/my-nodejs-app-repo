pipeline {
    agent any

    environment {
        IMAGE_NAME      = 'my-nodejs-app'
        IMAGE_TAG       = "${BUILD_NUMBER}"
        CONTAINER_NAME  = 'my-nodejs-app-container'
        APP_PORT        = '3000'
        HOST_PORT       = '3000'
    }

    stages {

        // ─────────────────────────────────────────
        // STAGE 1: Checkout
        // ─────────────────────────────────────────
        stage('Checkout') {
            steps {
                echo '📥 Checking out source code from GitHub...'
                git(
                    url: 'https://github.com/your-username/my-nodejs-app-repo.git',
                    branch: 'main',
                    credentialsId: 'github-credentials'  // ← ID you set in Jenkins
                )
            }
        }

        // ─────────────────────────────────────────
        // STAGE 2: Install Dependencies
        // ─────────────────────────────────────────
        stage('Install Dependencies') {
            steps {
                echo '📦 Installing Node.js dependencies...'
                sh 'npm install'
            }
        }

        // ─────────────────────────────────────────
        // STAGE 3: Test
        // ─────────────────────────────────────────
        stage('Test') {
            steps {
                echo '🧪 Running Jest tests...'
                sh 'npm test'
            }
            post {
                success {
                    echo '✅ All tests passed!'
                }
                failure {
                    echo '❌ Tests failed! Aborting pipeline.'
                }
            }
        }

        // ─────────────────────────────────────────
        // STAGE 4: Build Docker Image
        // ─────────────────────────────────────────
        stage('Build Docker Image') {
            steps {
                echo "🐳 Building Docker image: ${IMAGE_NAME}:${IMAGE_TAG}"
                sh """
                    docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                    docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest
                """
            }
            post {
                success {
                    echo "✅ Docker image ${IMAGE_NAME}:${IMAGE_TAG} built successfully!"
                }
                failure {
                    echo '❌ Docker image build failed!'
                }
            }
        }

        // ─────────────────────────────────────────
        // STAGE 5: Push to Docker Registry (Optional)
        // ─────────────────────────────────────────
        stage('Push to Registry') {
            when {
                expression { return env.DOCKER_REGISTRY?.trim() }
            }
            steps {
                echo "🚀 Pushing ${IMAGE_NAME}:${IMAGE_TAG} to ${DOCKER_REGISTRY}..."
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}
                        docker tag ${IMAGE_NAME}:latest    ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest
                        docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}
                        docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest
                    """
                }
            }
        }

        // ─────────────────────────────────────────
        // STAGE 6: Deploy to Docker Container
        // ─────────────────────────────────────────
        stage('Deploy') {
            steps {
                echo '🚢 Deploying application to Docker container...'
                sh """
                    # Stop and remove existing container if running
                    docker stop ${CONTAINER_NAME} || true
                    docker rm   ${CONTAINER_NAME} || true

                    # Run new container with restart policy
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        -p ${HOST_PORT}:${APP_PORT} \
                        -e NODE_ENV=production \
                        --restart unless-stopped \
                        ${IMAGE_NAME}:${IMAGE_TAG}

                    echo "✅ Container deployed: ${CONTAINER_NAME}"
                    docker ps | grep ${CONTAINER_NAME}
                """
            }
            post {
                failure {
                    echo '❌ Deployment failed! Rolling back...'
                    sh """
                        docker stop ${CONTAINER_NAME} || true
                        docker rm   ${CONTAINER_NAME} || true
                    """
                }
            }
        }

        // ─────────────────────────────────────────
        // STAGE 7: Health Check
        // ─────────────────────────────────────────
