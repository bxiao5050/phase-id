pipeline {
    agent { label 'jenkins-slave' }
    environment {
        project="jssdk"
        ppath="/data/packages/test/frontend"
        filename="${project}-${version}-$(date '+%Y%m%d%H%M%S').zip"
    }
    stages {
        stage('BUILD') {
            agent { docker {
                image 'reg.royale.com/ops/xynode:10-alpine'
                label 'jenkins-slave'
                args "-v ${ppath}:/data/app"
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
                            mkdir -p /data/app/${project}/${dt}
                            cp -rf build /data/app/${project}/${dt}/
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
                            cd ${ppath}/${project}/$(date '+%Y%m%d')
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
        stage('DEPLOY') {
            agent { label 'ansible' }
            steps {
                script {
                    try {
                        sh '''
                            cd ansible
                            src_file="${ppath}/${project}/${date '+%Y%m%d'}/${filename}"
                            dest_file="/data/server_new/${file_name}"
                            arch_file="${project}-${version}-$(date '+%Y%m%d%H%M%S').zip"
                            ansible-playbook -i hosts deploy.yml -- extra-var "src_file=${src_file} dest_file=${dest_file} version=${version} project=${project} arch_file=${arch_file}"
                            rm -f *.retry
                        '''
                    } catch(err) {
                        echo 'deploy error'
                        sh '/bin/sh ansible/notify.sh "deploy error" "${JOB_NAME}" "${BUILD_NUMBER}"'
                        throw err
                    }
                }
            }
        }
    }
}
