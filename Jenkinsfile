pipeline {
  agent any

  environment {
    DOCKERHUB_CREDENTIALS = credentials('dockerhub')
  }

  tools {
    nodejs '18.12.1'
  }

  stages {
    stage('Install dependencies') {
      steps {
        sh 'yarn'
      }
    }

    stage('Unit Tests') {
      steps {
        sh 'yarn test --coverage'
      }
      post {
        always {
          step([$class: 'CoberturaPublisher', coberturaReportFile: 'coverage/cobertura-coverage.xml'])
        }
      }
    }

    stage('Integration Tests') {
      steps {
        sh 'yarn test:int'
      }
    }

    stage('Build') {
      steps {
        sh 'yarn build'
      }
    }

    stage('Create image') {
      steps {
        sh 'docker build -t caiquetorres/course-platform .'
        sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
        sh 'docker push caiquetorres/course-platform'
      }
    }
  }

  post {
    always {
      sh 'docker logout'
    }
  }
}
