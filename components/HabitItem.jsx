import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function HabitItem({ id, titulo, concluidaHoje, onChangeStatus, onRemover }) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.item} onPress={() => onChangeStatus(id)}>
        <Text>{concluidaHoje ? "✅" : "⬜"} {titulo}</Text>
      </Pressable>
      <Pressable onPress={() => onRemover(id)}>
        <Text style={styles.lixeira}>✖️</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  item: { padding: 10, backgroundColor: '#f2f2f2', borderRadius: 8, flex: 1 },
  lixeira: { backgroundColor: '#ffdbdb', paddingVertical: 8, paddingHorizontal: 8, borderRadius: 8, marginLeft: 8 },
});