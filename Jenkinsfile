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

        stage('Checkout') {
            steps {
                echo '📥 Checking out source code from GitHub...'
                git(
                    url: 'https://github.com/brajeshk14jul/my-nodejs-app-repo.git',
                    branch: 'main',
                    credentialsId: 'github-credentials'
                )
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing Node.js dependencies...'
                sh 'npm install'
            }
        }

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

        stage('Deploy') {
            steps {
                echo '🚢 Deploying application to Docker container...'
                sh """
                    docker stop ${CONTAINER_NAME} || true
                    docker rm   ${CONTAINER_NAME} || true

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
                    echo '❌ Deployment failed!'
                    sh """
                        docker stop ${CONTAINER_NAME} || true
                        docker rm   ${CONTAINER_NAME} || true
                    """
                }
            }
        }

        stage('Health Check') {
            steps {
                echo '🏥 Running health check...'
                sh """
                    sleep 5
                    curl -f http://localhost:${HOST_PORT}/health \
                        && echo "✅ Health check passed!" \
                        || (echo "❌ Health check failed!" && exit 1)
                """
            }
        }

        stage('Verify API') {
            steps {
                echo '🔍 Verifying API routes...'
                sh """
                    curl -f http://localhost:${HOST_PORT}/ \
                        && echo "✅ GET / is UP" \
                        || echo "⚠️  GET / check failed"

                    curl -f http://localhost:${HOST_PORT}/api/users \
                        && echo "✅ GET /api/users is UP" \
                        || echo "⚠️  GET /api/users check failed"
                """
            }
        }
    }

    post {
        success {
            echo """
            ╔══════════════════════════════════════╗
            ║       ✅ PIPELINE SUCCESS             ║
            ╠══════════════════════════════════════╣
            ║  Image    : ${IMAGE_NAME}:${IMAGE_TAG}
            ║  Container: ${CONTAINER_NAME}
            ║  App URL  : http://localhost:${HOST_PORT}
            ║  Users API: http://localhost:${HOST_PORT}/api/users
            ║  Health   : http://localhost:${HOST_PORT}/health
            ╚══════════════════════════════════════╝
            """
        }
        failure {
            echo '❌ Pipeline FAILED! Check the logs above.'
            sh """
                docker stop ${CONTAINER_NAME} || true
                docker rm   ${CONTAINER_NAME} || true
            """
        }
        always {
            echo '🧹 Cleaning up dangling Docker images...'
            sh 'docker image prune -f || true'
        }
    }
}
