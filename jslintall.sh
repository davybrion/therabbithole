for f in `find . -path './node_modules' -prune -o -name '*.js'`
do
  if [ -f $f ]; then
    node_modules/jslint/bin/jslint.js $f;
  fi
done
