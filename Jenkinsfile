pipeline {
    agent any
    stages {
        stage('BUILD') {
            agent { docker {
                image 'reg.royale.com/ops/xynode:10-alpine'
                args '-v /data/jenkins/packages/prod-build/frontend/jssdk:/data/app'
            }}
            steps {
                script {
                    try {
                        sh 'rm -rf node_modules dist build'
                        sh 'npm install'
                        sh '''
                            echo "---------------------------------------------------------"
                            mkdir -p /data/app/build

                            for region in sg vn de; do
                                [[ -d build/${version} ]] && rm -rf build/${version}
                                echo "npm run build-${region} ${version}"
                                npm run build-${region} ${version}
                                cp -rf  build/${version} /data/app/build/${region}-${version}
                                echo "---------------------------------------------------------"
                                echo ""
                            done
                        '''
                    } catch(err) {
                        echo 'npm build error'
                        sh '/bin/sh ansible/notify.sh "npm build error" "${JOB_NAME}" "${BUILD_NUMBER}"'
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
                            current_path=$(pwd)
                            package_path=$(date '+%Y%m%d')
                            mkdir -p /data/jenkins/packages/prod-build/frontend/jssdk/${package_path}
                            for region in sg vn de; do
                                cd /data/jenkins/packages/prod-build/frontend/jssdk
                                dt=$(date '+%Y%m%d%H%M%S')
                                file_name=jssdk-${region}-${version}-${dt}.zip
                                cd build/${region}-${version}
                                zip -qr ${file_name} *
                                mv ${file_name} ../../${package_path}
                                package_url="http://jenkins.royale.com/packages/prod-build/frontend/jssdk/${package_path}/${file_name}"
                                cd ${current_path}
                                /bin/sh ansible/notify.sh "build-${region} ${version} success &PACKAGES: ${package_url}" "${JOB_NAME}" "${BUILD_NUMBER}"                            
                            done
                            cd /data/jenkins/packages/prod-build/frontend/jssdk
                            rm -rf build
                        '''
                    } catch(err) {
                        echo 'npm package error'
                        sh '/bin/sh ansible/notify.sh "npm package error" "${JOB_NAME}" "${BUILD_NUMBER}"'
                        throw err
                        sh 'exit 1'
                    }
                }
            }
        }
    }
}