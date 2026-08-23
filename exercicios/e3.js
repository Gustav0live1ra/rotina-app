const buscarPost = async () => {
    try {
        const post = await fetch("https://jsonplaceholder.typicode.com/posts/1");
        const dado = await post.json();
        console.log(dado);
    } catch (error) {
        console.log("Ocorreu o erro: ", error);
    }
}

buscarPost();