var granimInstance = new Granim({
    element: '#bg',
    name: 'basic-gradient',
    direction: 'left-right',
    opacity: [1, 1],
    isPausedWhenNotInView: true,
    states : {
        "default-state": {
            gradients: [
                ['#02AAB0', '#00CDAC'],
                ['#DA22FF', '#9733EE'],
                ['#AA076B', '#61045F']
            ]
        }
    }
});
