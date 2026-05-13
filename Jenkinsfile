pipeline {
    agent any
    tools {
        nodejs 'NodeJS'
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Ny3ndrak/nyendrak_02240352_DSO101_A1.git',
                    credentialsId: 'github-creds'
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('Assignment_1/backend') {
                    bat 'npm install'
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('Assignment_1/frontend') {
                    bat 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('Assignment_1/frontend') {
                    bat 'npm run build'
                }
            }
        }

        stage('Run Tests') {
            steps {
                dir('Assignment_1/backend') {
                    bat 'npm test'
                }
            }
            post {
                always {
                    junit 'Assignment_1/backend/junit.xml'
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    docker.build('ny3ndr4k/be-todo:02240352', './Assignment_1/backend')
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-creds') {
                        docker.image('ny3ndr4k/be-todo:02240352').push()
                    }
                }
            }
        }
    }
}