export async function stagedAsync<Argument, Result>(func: (arg: Argument) => Promise<Result[]>, args: readonly Argument[], concurrent = 10): Promise<Result[]> {
	const results: Result[][] = []

	while (results.length < args.length) {
		const stepResults = await Promise.all(
			args
				.slice(results.length, results.length + concurrent)
				.map(o => func(o))
		)

		results.push(...stepResults)
	}

	return results.flat()
}
