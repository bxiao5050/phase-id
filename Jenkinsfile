pipeline {
    agent { label 'jenkins-slave' }
    stages {
        stage('BUILD') {
            agent { docker {
                image 'reg.royale.com/ops/xynode:10-alpine'
                label 'jenkins-slave'
                args '-v /data/packages/test/frontend:/data/app'
            }}
            steps {
                script {
                    try {
                        sh 'rm -rf node_modules dist build'
                        sh 'npm install'
                        sh '''
                            [[ -z ${version} ]] && echo "not input version" && exit 1
                            npm run build-test ${version}

                            dt=$(date '+%Y%m%d')
                            mkdir -p /data/app/jssdk/${dt}
                            cp -rf build /data/app/jssdk/${dt}/
                        '''
                    } catch(err) {
                        echo 'npm build error'
                        sh '/bin/sh ansible/notify.sh "npm install error" "${JOB_NAME}" "${BUILD_NUMBER}"'
                        throw err
                        sh 'exit 1'
                    }
                }
            }
        }
        stage('PACKAGE') {
            steps {
                script {
                    try {
                        sh '''
                            cd /data/packages/test/frontend/jssdk/$(date '+%Y%m%d')
                            filename=jssdk-${version}-$(date '+%Y%m%d%H%M%S').zip
                            cd build/${version}
                            zip -qr ${filename} *
                            mv ${filename} ../../
                            cd ../../
                            rm -rf build
                        '''
                    } catch(err) {
                        echo 'package error'
                        sh '/bin/sh ansible/notify.sh "package error" "${JOB_NAME}" "${BUILD_NUMBER}"'
                        throw err
                        sh 'exit 1'
                    }
                }
            }
        }
        stage('ANSIBLE') {
            agent { label 'ansible' }
            steps {
                script {
                    try {
                        sh '''
                            /sbin/ifconfig
                        '''
                    } catch(err) {
                        echo 'error'
                        throw err
                    }
                }
            }
        }
    }
}
