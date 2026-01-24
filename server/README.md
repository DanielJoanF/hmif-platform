# Setup MongoDB Password

Sebelum menjalankan server, Anda perlu mengisi password MongoDB di file `.env`.

## Langkah-langkah:

1. Buka file `.env` di root directory project
2. Ganti `<db_password>` dengan password database yang Anda buat di MongoDB Atlas
3. Save file tersebut

Contoh:
```
MONGODB_URI=mongodb+srv://HMIF_DB:passwordAnda123@hmifdb.kjwptji.mongodb.net/hmif-platform?retryWrites=true&w=majority&appName=hmifDB
PORT=5000
```

Setelah itu, server siap dijalankan!
