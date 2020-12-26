make
for i in $(seq -w 1 16)
do
echo "\ntest ${i}\n"
./poker provided-tests/test${i}.txt
done