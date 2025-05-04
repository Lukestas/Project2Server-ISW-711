export const verifyParentPin = async (req, res) => {
    try {
        const { pin } = req.body;
        const verifyPinParent = await Parent.findById(req.parent.id);
        if (!parent) {
            return res.status(404).json(["Padre no encontrado"]);
        }
        if (verifyPinParent.pin !== pin) {
            return res.status(400).json(["El PIN es incorrecto"]);
        }
        res.status(200).json(true);
    }
    catch (error) {
        res.status(500).json({ message: "Error al realizar la verificación de pin", error });
    }
}

export const verifyChildPin= async (req, res) => {
    try {
        const { pin, id } = req.body;
        const verifyPinChild = await Child.findById(id);
        if (!child) {
            return res.status(404).json(["Niño no encontrado"]);
        }
        if (verifyPinChild.pin !== pin) {
            return res.status(400).json(["El PIN es incorrecto"]);
        }
        res.status(200).json(true);
    }
    catch (error) {
        res.status(500).json({ message: "Error al realizar la verificación de pin", error });
    }
}