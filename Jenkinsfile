pipeline {
    agent { label 'jenkins-slave' }
    environment {
        project = "jssdk"
        ppath = "/data/k8s/packages/prod/frontend"
        purl = "http://packages.royale.com/prod/frontend"
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
                            dt=$(date '+%Y%m%d')
                            mkdir -p /data/app/${project}/${dt}/build
                            for region in sg vn de; do
                                npm run build-${region} ${version}
                                cp -rf build/${version} /data/app/${project}/${dt}/build/${region}-${version}
                            done
                        '''
                    } catch(err) {
                        echo 'npm build error'
                        sh '/bin/sh ansible/notify.sh "npm build error" "${JOB_NAME}" "${BUILD_NUMBER}"'
                        throw err
                    }
                }
            }
        }
        stage('PACKAGE') {
            steps {
                script {
                    try {
                        sh '''
                            workspace=$(pwd)
                            dt=$(date '+%Y%m%d')
                            for region in sg vn de; do
                                cd ${ppath}/${project}/${dt}/build/${region}-${version}
                                filename="${project}-${region}-${version}-$(date '+%Y%m%d%H%M%S').zip"
                                zip -qr ${filename} *
                                mv ${filename} ../../
                                cd ${workspace}/ansible
                                packageurl=${purl}/${project}/${dt}/${filename}
                                /bin/sh notify.sh "build-${region} ${version} success &PACKAGES: ${packageurl}" "${JOB_NAME}" "${BUILD_NUMBER}"
                            done
                            rm -rf ${ppath}/${project}/${dt}/build
                        '''
                    } catch(err) {
                        echo 'package error'
                        sh '/bin/sh ansible/notify.sh "package error" "${JOB_NAME}" "${BUILD_NUMBER}"'
                        throw err
                    }
                }
            }
        }
    }
}
