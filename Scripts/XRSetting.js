function EnterXRSession() {
    navigator.xr.isSessionSupported('immersive-ar')
        .then((isSupported) => {
            if (isSupported) {
                document.getElementById("enterar").click();
                return;
            }
            else {
                navigator.xr.isSessionSupported('immersive-vr')
                    .then((isSupported2) => {
                        if (isSupported2) {
                            document.getElementById("entervr").click();
                            return;
                        }
                    });
            }
        });
}
