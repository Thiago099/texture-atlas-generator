# Texture atlas generator

Here is what the program looks like, you can fill the parameters on the right and it will generate a low-resolution preview of your atlas, after you are done configuring you can click on download to download a high-resolution zip with your assets

![image](https://github.com/user-attachments/assets/84e1b9bd-173e-4850-b437-3cd4174db448)


Link:
https://thiago099.github.io/texture-atlas-generator/


Output:

📁 Generated Zip File
│
├── 🖼️ reference.png  This is your atlas overlayed with the index of each element on the generated json files
├── 🖼️ texture.png This is the final atlas for you to import on your program
├── 📄 chunkUvs.json This is the UV of each texture, where each corner of the chunk will be the corner of your mesh (useful if your texture are something like icons so you don't have to worry about the aspect ratio)
└── 📄 exactUvs.json This is the UV of each texture, where each corner of your texture will be the corner of your mesh

![image](https://github.com/user-attachments/assets/4aac7282-42eb-47e1-86af-76e519349968)
