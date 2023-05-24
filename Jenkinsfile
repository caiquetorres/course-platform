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
      script {
        def title
        def description

        if (currentBuild.currentResult == 'SUCCESS') {
          title = 'Pipeline succeeded!'
          description = "The app has been built and has already been uploaded to DockerHub"
        } else {
          title = 'Pipeline failed!'
          description = "Something happened while running the pipeline"
        }

        discordSend description: description, footer: '', image: '', link: '', result: currentBuild.currentResult, scmWebUrl: '', thumbnail: '', title: title, webhookURL: 'https://discord.com/api/webhooks/1109608740216389702/xAUq1P10hz8HFYoEiKAbWkbkVk3bw-yvEE-s0Wwauge_6vkL7mvTThHzNwaAgWg86v5l'
      }
    }
  }
}
