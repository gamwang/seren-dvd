## run browserify on the client side javascript if any of the .js files
## are newer then the browserified file(s)
for item in $(ls -C1 *.js); do
    if [ ${item} -nt public/javascripts/clientSide.js ] || [ ${item} -nt public/javascripts/graph_modules/*.js ]; then
        ## create the javascripts directory if it doesn't already exist
        if [ ! -d public/javascripts ]; then
            mkdir public/javascripts
        fi
        node_modules/.bin/browserify clientSide.js > public/javascripts/clientSide.js
      break
    fi
done
