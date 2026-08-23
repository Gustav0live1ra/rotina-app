import { useState } from "react";

function contador(){
    const [contador, setcontador] = useState(0);

    return (
        <div>
            <p>Valor: {contador}</p>
            <button onClick={() => setcontador(contador+1)}>INCREMENTAR</button>
        </div>
    )
}

contador();