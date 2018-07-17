for x in `ls *.md`
do
   perl -p0e 's#---\n(.*\n.*\n.*\n---\n)#---\nlayout: post\n\1\n{% include toc.html %}#' ${x} > tmp
   mv tmp ${x}
done
