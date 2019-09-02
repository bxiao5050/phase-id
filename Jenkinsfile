pipeline {
    agent none
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
                            package_path=$(date '+%Y%m%d')
                            mkdir -p /data/app/${package_path}

                            for region in sg vn de; do
                                [[ -d build/${version} ]] && rm -rf build/${version}
                                echo "npm run build-${region} ${version}"
                                npm run build-${region} ${version}
                                dt=$(date '+%Y%m%d%H%M%S')
                                file_name=jssdk-${region}-${version}-${dt}.zip
                                cd build/${version}
                                [[ -s ${file_name} ]] && rm -f ${file_name}
                                zip -qr ${file_name} *
                                mv ${file_name} /data/app/${package_path}/
                                cd ../..
                                package_url="http://jenkins.royale.com/packages/prod-build/frontend/jssdk/${package_path}/${file_name}"
                                /bin/sh ansible/notify.sh "build-${region} ${version} succcess &&PACKAGES: ${package_url}" "${JOB_NAME}" "${BUILD_NUMBER}"
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
    }
}