pipeline {
    agent none
    environment {
        project = "jssdk"
        ppath = "/data/k8s/packages/test/frontend"
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
                            cd build/${version}
                            filename="${project}-${version}-$(date '+%Y%m%d%H%M%S').zip"
                            zip -qr ${filename} *                            

                            cp -rf ${filename} /data/app/${project}/${dt}/
                            echo ${filename} > /data/app/${project}/${dt}/file.txt
                        '''
                    } catch(err) {
                        echo 'npm build error'
                        sh '/bin/sh ansible/notify.sh "npm build error" "${JOB_NAME}" "${BUILD_NUMBER}"'
                        throw err
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
                            workspace=$(pwd)
                            cd ${ppath}/${project}/$(date '+%Y%m%d')
                            filename=$(cat file.txt)

                            cd ${workspace}/ansible
                            src_file="${ppath}/${project}/$(date '+%Y%m%d')/${filename}"
                            dest_file="/data/server_new/${filename}"
                            arch_file="${project}-${version}-$(date '+%Y%m%d%H%M%S').zip"
                            ansible-playbook -i hosts deploy.yml --extra-var "src_file=${src_file} dest_file=${dest_file} version=${version} project=${project} arch_file=${arch_file}"
                            rm -f *.retry
                            /bin/sh notify.sh "deploy success" "${JOB_NAME}" "${BUILD_NUMBER}"
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
