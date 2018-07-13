for x in `ls *.md`
do
   name=`echo $x | sed 's%_\?\([A-Z]\)%|\1%g' | tr '[:upper:]|' '[:lower:]-'`
   name="2017-01-01$name"
   echo $name
   mv $x $name
done



