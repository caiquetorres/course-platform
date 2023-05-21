pipeline {
  agent any

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

    stage('E2E Tests') {
      steps {
        sh 'yarn test:e2e'
      }
    }

    stage('Build') {
      steps {
        sh 'yarn build'
      }
    }
  }
}
