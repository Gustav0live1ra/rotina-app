import {View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TaskItem from '@/components/TaskItem';




// faça: coloque a secao de concluidas aqui, juntamente com a configuração de cada tarefa
// feito isso tire a secao de concluidas da Home, A ideia é: a tarefa foi concluida? ent deleta ela, n é mais relevante.





export default function RotinaScreen() {
    const [rotina, setRotina] = useState([]);
    const [novoTitulo, setNovoTitulo] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [mostrarConcluidas, setMostrarConcluidas] = useState(false);

    useEffect(() => {
        const carregarRotina = async () =>{
            try {
                const dadosSalvos = await AsyncStorage.getItem('@rotina');
                if(dadosSalvos !== null){
                    setRotina(JSON.parse(dadosSalvos));
                }
            } catch(erro){
                console.log("Erro ao carregar rotina: ", erro);
            } finally {
                setCarregando(false);
            }
        };
        carregarRotina();
    }, []);

    useEffect(() => {
        if(carregando) return;
        const salvarRotina = async () => {
            try {
                await AsyncStorage.setItem('@rotina', JSON.stringify(rotina))
            } catch (erro) {
                console.log("Erro ao salvar rotina: ",erro);
            }
        };
        salvarRotina();
    }, [rotina, carregando]);

    const adicionarTarefa = () => {
        if(novoTitulo === "") return;
        const novaTarefa = {
            id: Date.now(),
            titulo: novoTitulo,
            concluidaHoje: false,
            ultimaDataConcluida: null,
        };
        setRotina([...rotina, novaTarefa]);
        setNovoTitulo("");
    };

    const alternarConcluida = (id) => {
        setRotina(rotina.map((tarefa) =>
            tarefa.id === id ? {...tarefa, concluidaHoje: !tarefa.concluidaHoje } : tarefa
        ));
    };

    const removerTarefa = (id) => {
        setRotina(rotina.filter((tarefa) => tarefa.id !== id))
    };

    const pendentes = rotina.filter((tarefa) => tarefa.concluidaHoje === false);
    const concluidas = rotina.filter((tarefa) => tarefa.concluidaHoje === true);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rotina</Text>

            <TextInput
                style={styles.input}
                placeholder='Novo Hábito'
                value={novoTitulo}
                onChangeText={setNovoTitulo}
            />
            <Pressable style={styles.button} onPress={adicionarTarefa}>
                <Text>Adicionar</Text>
            </Pressable>
            
            <View style={styles.lista}>
                {pendentes.map((tarefa) => (
                <TaskItem key={tarefa.id}
                    {...tarefa}
                    prioridade = {null}
                    concluida = {null}
                    onChangeStatus = {alternarConcluida}
                    onRemover = {removerTarefa}
                    
                />
                ))}
            </View>

            <View style={styles.secaoConcluidas}>
                <Pressable onPress={() => setMostrarConcluidas(!mostrarConcluidas)}>
                    <Text style={styles.toggleTexto}>
                        {mostrarConcluidas ? "▼" : "▶"} Concluídas ({concluidas.length})
                    </Text>
                </Pressable>

                {mostrarConcluidas && (
                    <View style={styles.lista}>   
                        {concluidas.map((tarefa) => (
                        <TaskItem key={tarefa.id}
                            {...tarefa}
                            prioridade = {null}
                            concluida = {null}
                            onChangeStatus = {alternarConcluida}
                            onRemover = {removerTarefa}
                            
                        />
                        ))}
                    </View> 
                )}
            </View>
        </View>

    );
}


const styles = StyleSheet.create({
 container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 12 },
  button: { backgroundColor: '#ccc', padding: 10, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
  lista: { gap: 8 },
  item: { padding: 10, backgroundColor: '#f2f2f2', borderRadius: 8 },
  secaoConcluidas: { marginTop: 20 },
  toggleTexto: { fontSize: 15, fontWeight: '600', color: '#6B7280', marginBottom: 8 },
})