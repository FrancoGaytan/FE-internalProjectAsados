import { useTranslation } from "../../stores/LocalizationContext"
import FormLayout from '../../Components/macro/layout/FormLayout'
import styles from './styles.module.scss';
import Button from "../../Components/micro/Button/Button";
import React, { useEffect, useState } from "react";

const CreateEvent = () => {
    const translation = useTranslation('createEvent')
    const [diners, setDiners] = useState(1);
    const [hidden, setHidden] = useState(true);

    const handleDinersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = parseInt(event.target.value);
        if (value >= 100) {
            setDiners(100);
        } else if (value <= 0) {
            setDiners(0)
        } else {
            setDiners(value)
        }
    }

    const handleHiddenRange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHidden(!event.target.checked)
    }

    return (
        <FormLayout>
            <div className={styles.closeBtn}></div>
            <label className={styles.title}>Crear Evento</label>
            <div className={styles.inputSection}>
                <section className={styles.column}>
                    <label htmlFor="nombreEvento" className={styles.fieldLabel}>
                        Nombre del Evento (opcional)
                    </label>
                    <input id="nombreEvento" placeholder="Nombre del Evento (opcional)" type="text" />
                    <label htmlFor="fechaHora" className={styles.fieldLabel}>
                        Fecha y Hora
                    </label>
                    <input id="fechaHora" placeholder="Fecha y Hora" type="text" />
                    <label htmlFor="descripcion" className={styles.fieldLabel}>
                        Descripción
                    </label>
                    <textarea id="descripcion" name="descripcion" className={styles.textArea} placeholder="Descripción" />
                </section>
                <section className={styles.column}>
                    <section className={styles.checkboxesContainer}>
                        <div className={styles.internalTitle}>
                            <label className={styles.title}>Roles</label>
                            <span className={styles.extraDescription}>(opcional)</span>
                        </div>
                        <label htmlFor="isAsador" className={styles.fieldLabel}>
                            <input id="isAsador" type="checkbox" className={styles.checkbox} onChange={handleHiddenRange} />
                            Asador
                        </label>
                        <label htmlFor="isEncargadoCompras" className={styles.fieldLabel}>
                            <input id="isEncargadoCompras" type="checkbox" className={styles.checkbox} />
                            Encargado de Compras
                        </label>
                    </section>
                    <section className={styles.rangeSelectionContainer} hidden={hidden}>
                        <label htmlFor="diners" className={styles.fieldLabel} >
                            Cantidad Máxima de Comensales
                        </label>
                        <input
                            id="dinersRange"
                            type="range"
                            min={0}
                            max={100}
                            list="dinersMarkers"
                            step={1}
                            value={diners}
                            onChange={handleDinersChange} />
                        <input
                            id="dinersQuantity"
                            className={styles.dinersQuantity}
                            type="number"
                            value={diners}
                            max={100}
                            min={0}
                            onChange={handleDinersChange} />
                        <datalist id="dinersMarkers">
                            <option value="0" label="0" />
                            <option value="25" label="25" />
                            <option value="50" label="50" />
                            <option value="75" label="75" />
                            <option value="100" label="100" />
                        </datalist>
                    </section>
                </section>
            </div>
            <Button kind="primary" size="large" id='registerBtn' style={{ marginBottom: 30 }}>
                CREAR EVENTO
            </Button>
        </FormLayout>
    )
}

export default CreateEvent;