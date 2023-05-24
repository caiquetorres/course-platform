pipeline {
  agent any

  tools {
    nodejs '18.12.1'
  }

  environment {
    DOCKERHUB_CREDENTIALS = credentials('dockerhub')
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
        sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'

        sh 'docker build -t course-platform .'
        sh 'docker tag course-platform caiquet/course-platform:lastest'

        sh 'docker push caiquet/course-platform:lastest'
      }
    }
  }

  post {
    always {
      sh 'docker logout'
    }
  }
}
