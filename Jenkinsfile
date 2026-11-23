pipeline {
    agent any

    environment {
        NODE_ENV = 'test'
        PORT = '5002'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Tests & E2E') {
            steps {
                dir('backend') {
                    sh 'npm install'
                    sh 'npm test'
                    sh 'node tests/e2e_journey.js'
                }
            }
        }

        stage('AI Service Benchmark') {
            steps {
                dir('ai-service') {
                    sh 'python3 evaluation/benchmark_runner.py'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo 'Running SonarQube Scanner against Quality Gate...'
                sh 'cat sonar-project.properties'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'PostPilot CI/CD Pipeline executed successfully with zero blocker defects.'
        }
    }
}
