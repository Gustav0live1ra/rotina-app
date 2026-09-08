import { View, Text, StyleSheet, Pressable } from 'react-native';

const coresPrioridade = {
  Alta: '#EF4444',
  Média: '#F59E0B',
  Baixa: '#10B981',
};

export default function TaskItem({ id, titulo, concluida, prioridade, onChangeStatus, menuAberto, onToggleMenu, onIniciarEdicao }) {
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.taskItem, { borderLeftColor: coresPrioridade[prioridade], borderLeftWidth: 4 }]}
        onPress={() => onChangeStatus(id)}
      >
        <Text>{concluida ? "✅" : "⬜"} {titulo}</Text>
      </Pressable>
      
      <Pressable onPress={() => onToggleMenu(id)}>
        <Text style={styles.pontinhos}>⋮</Text>
      </Pressable>

      {menuAberto && (
        <View style={styles.menu}>
          <Pressable onPress={() => onIniciarEdicao(id)}>
            <Text style={styles.menuItem}>Editar</Text>
          </Pressable>
          <Pressable onPress={() => onChangeStatus(id)}>
            <Text style={styles.menuItem}>Concluir</Text>
          </Pressable>
        </View>
      )}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  taskItem: { 
    padding: 10, backgroundColor: '#f3eeee', borderRadius: 8, flex: 1 },
  pontinhos: {
    fontSize: 20, paddingHorizontal: 8 },
  menu: {
    position: 'absolute', top: 30, right: 0, backgroundColor: '#fff',borderRadius: 8, padding: 8, 
    elevation: 4, shadowColor: '#000',shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, 
    shadowRadius: 4, zIndex: 10 },
  menuItem: { paddingVertical: 6, paddingHorizontal: 12 }, 
  
});