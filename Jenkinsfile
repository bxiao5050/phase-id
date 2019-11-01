pipeline {
<<<<<<< HEAD
    agent none
    environment {
        project = "jssdk"
        ppath = "/data/packages/test/frontend"
        rpath = "/data/k8s/packages/test/frontend"
=======
    agent { label 'jenkins-slave' }
    environment {
        project = "jssdk"
        ppath = "/data/packages/prod/frontend"
        purl = "http://packages.royale.com/prod/frontend"
>>>>>>> master
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
                        sh '[[ -z ${version} ]] && echo "not input version" && exit 1'
                        sh '''
<<<<<<< HEAD
                            [[ -z ${version} ]] && echo "not input version" && exit 1
                            npm run build-test ${version}
                            dt=$(date '+%Y%m%d')
                            mkdir -p /data/app/${project}/${dt}
                            rm -rf /data/app/${project}/${dt}/build
                            cp -rf build /data/app/${project}/${dt}/
=======
                            dt=$(date '+%Y%m%d')
                            mkdir -p /data/app/${project}/${dt}/build
                            for region in sg vn de; do
                                npm run build-${region} ${version}
                                cp -rf build/${version} /data/app/${project}/${dt}/build/${region}-${version}
                            done
>>>>>>> master
                        '''
                    } catch(err) {
                        echo 'npm build error'
                        sh '/bin/sh ansible/notify.sh "npm build error" "${JOB_NAME}" "${BUILD_NUMBER}"'
                        throw err
                    }
                }
            }
        }
<<<<<<< HEAD
        stage('DEPLOY') {
            agent { label 'ansible' }
=======
        stage('PACKAGE') {
>>>>>>> master
            steps {
                script {
                    try {
                        sh '''
                            workspace=$(pwd)
<<<<<<< HEAD
                            cd ${rpath}/${project}/$(date '+%Y%m%d')
                            cd build/${version}
                            filename="${project}-${version}-$(date '+%Y%m%d%H%M%S').zip"
                            zip -qr ${filename} *
                            mv ${filename} ../../
                            cd ../../
                            rm -rf build

                            cd ${workspace}/ansible
                            src_file="${rpath}/${project}/$(date '+%Y%m%d')/${filename}"
                            dest_file="/data/server_new/${filename}"
                            arch_file="${project}-${version}-$(date '+%Y%m%d%H%M%S').zip"
                            ansible-playbook -i hosts deploy.yml --extra-var "src_file=${src_file} dest_file=${dest_file} version=${version} project=${project} arch_file=${arch_file}"
                            rm -f *.retry
                            /bin/sh notify.sh "deploy success" "${JOB_NAME}" "${BUILD_NUMBER}"
                        '''
                    } catch(err) {
                        echo 'deploy error'
                        sh '/bin/sh ansible/notify.sh "deploy error" "${JOB_NAME}" "${BUILD_NUMBER}"'
=======
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
>>>>>>> master
                        throw err
                    }
                }
            }
        }
    }
}
