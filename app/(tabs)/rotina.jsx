import {View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HabitItem from '@/components/HabitItem';
import { Alert } from 'react-native';
import { Animated } from 'react-native';
import { useRef } from 'react';


export default function RotinaScreen() {
    const [rotina, setRotina] = useState([]);
    const [novoTitulo, setNovoTitulo] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [mostrarConcluidas, setMostrarConcluidas] = useState(false);
    const [streak, setStreak] = useState(0);
    const [diaAvaliado, setDiaAvaliado] = useState(null);
    const [streakSubiu, setStreakSubiu] = useState(false);
    
    const pendentes = rotina.filter((tarefa) => tarefa.concluidaHoje === false);
    const concluidas = rotina.filter((tarefa) => tarefa.concluidaHoje === true);

    useEffect(() => {
        const carregarDados = async () =>{
            try {
                const dadosRotina = await AsyncStorage.getItem('@rotina');
                const dadosStreak = await AsyncStorage.getItem('@streak');

                const hoje = getHoje();
                const ontem = getOntem();

                const rotinaCarregada = dadosRotina !== null ? JSON.parse(dadosRotina) : [];
                const streakSalva = dadosStreak !== null ? JSON.parse(dadosStreak) : {streak: 0, diaAvaliado: null};

                let novoStreak = streakSalva.streak;

                if(streakSalva.diaAvaliado !== hoje){
                    //iniciou novo dia
                    if(streakSalva.diaAvaliado === ontem) {
                        //se só passou 1 dia, julga se ontem finalizou a rotina
                        const completouOntem = rotinaCarregada.length > 0 &&
                         rotinaCarregada.every((tarefa) => tarefa.concluidaHoje === true);
                        novoStreak = completouOntem ? streakSalva.streak + 1 : 0;
                    } else {
                        novoStreak = 0;
                    }
                } 

                if (novoStreak > streakSalva.streak) {
                    setStreakSubiu(true);
                }
                //reseta concluidaHoje
                const rotinaAtualizada = rotinaCarregada.map((tarefa) => ({
                    ...tarefa,
                    concluidaHoje: tarefa.ultimaDataConcluida === hoje,
                }));
                setRotina(rotinaAtualizada);
                setStreak(novoStreak);
                setDiaAvaliado(hoje);

            } catch(erro){
                console.log("Erro ao carregar rotina: ", erro);
            } finally {
                setCarregando(false);
            }
        };
        carregarDados();
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

    useEffect(() => {
        if (carregando) return;
        const salvarStreak = async () => {
            try{
                await AsyncStorage.setItem('@streak',JSON.stringify({streak, diaAvaliado}));
            } catch (erro) {
                console.log("Erro ao salvar streak:", erro);
            }
        };
        salvarStreak();
    }, [streak, diaAvaliado, carregando]);

    useEffect(() => {
        if(!streakSubiu) return;

        Animated.sequence([
            Animated.timing(escala, { toValue: 1.5, duration: 200, useNativeDriver: true }),
            Animated.spring(escala, { toValue: 1, friction: 3, useNativeDriver: true }),
        ]).start(() => setStreakSubiu(false)); // reseta a flag ao terminar
    }, [streakSubiu]);

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
        const hoje = getHoje();
        setRotina(rotina.map((tarefa) =>
            tarefa.id === id ? {
                ...tarefa,
                concluidaHoje: !tarefa.concluidaHoje,
                ultimaDataConcluida: !tarefa.concluidaHoje ? hoje : null
            }
            : tarefa
        ));
    };

    const removerTarefa = (id) => {
        setRotina(rotina.filter((tarefa) => tarefa.id !== id))
    };

    const confirmarRemocao = (id) => {
        let nome = rotina.find((tarefa) => tarefa.id === id);
        nome = nome.titulo;
        Alert.alert (
            "Remover Hábito",
            `Deseja realmente deletar '${nome}'?`,
            [
                { text: "Cancelar", style: 'cancel'},
                { text: "confirmar", style: 'destructive', onPress: () => removerTarefa(id)}
            ]
        )
    };

    const getHoje = () => new Date().toISOString().split('T')[0];
    const getOntem = () => {
        const data = new Date();
        data.setDate(data.getDate() - 1);
        return data.toISOString().split('T')[0];
    };

    const escala = useRef(new Animated.Value(1)).current;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rotina</Text>
            
            <Animated.Text style={[styles.streakTexto, {transform: [{scale: escala}] }]}>
                🔥 Streak: {streak} {streak === 1 ? "dia" : "dias"} 
            </Animated.Text>

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
                <HabitItem key={tarefa.id}
                    {...tarefa}
                    onChangeStatus = {alternarConcluida}
                    onRemover = {confirmarRemocao}
                    
                />
                ))}
            </View>
            
            {pendentes.length === 0 && (
                <Text style={{textAlign: 'center', color: '#6B7280',marginTop: 10,}}
                > Rotina finalizada, Parabéns!! </Text>
            )}

            <View style={styles.secaoConcluidas}>
                <Pressable onPress={() => setMostrarConcluidas(!mostrarConcluidas)}>
                    <Text style={styles.toggleTexto}>
                        {mostrarConcluidas ? "▼" : "▶"} Concluídas ({concluidas.length})
                    </Text>
                </Pressable>

                {mostrarConcluidas && (
                    <View style={styles.lista}>   
                        {concluidas.map((tarefa) => (
                        <HabitItem key={tarefa.id}
                            {...tarefa}                   
                            onChangeStatus = {alternarConcluida}
                            onRemover = {confirmarRemocao}
                            
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
  streakTexto: {textAlign: 'right'},
})