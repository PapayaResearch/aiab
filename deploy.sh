if [[ -z "${DEPLOY_PATH}" ]]; then
  echo "DEPLOY_PATH not set. Please set it to the path where you want to deploy the site."
  exit 1
fi

echo "NEXT_PUBLIC_DEPLOY_PATH=${DEPLOY_PATH}" > .env.local

USR=$(echo $DEPLOY_PATH | sed -E 's#/~([^/]+)/([^/]+)#\1#')
TGT=$(echo $DEPLOY_PATH | sed -E 's#/~([^/]+)/([^/]+)#\2#')
USR_LOGIN=$(echo $USR | sed 's/~//')

yarn build
rm -rf $TGT
mv out $TGT
rsync -zarvh --progress $TGT/ $USR_LOGIN@ml.media.mit.edu:public_html/$TGT/