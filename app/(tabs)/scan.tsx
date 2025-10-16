import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Scan() {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>Scan Placeholder</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
		alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		color: '#fff',
		fontSize: 22,
		fontWeight: '600',
	},
});
