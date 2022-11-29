namafile=input('Masukkan nama file (contoh : file.js / file.css :')
outputfile=namafile.split(".")
outputfile=outputfile[0]+".min."+outputfile[1]
fl=open(namafile,"r")
for baca in fl.readlines():
    fl_2=open(outputfile,"a")
    fl_2.write(baca.replace("\n","").replace(" {","{").replace("  ",""))
    print(baca.replace("\n","").replace(" {","{").replace("  ",""))
fl_2.close()
fl.close()