import styles from './styles.module.scss';
import Button from '../../micro/Button/Button';
import { useTranslation } from '../../../stores/LocalizationContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getEventById } from '../../../service';
import { EventByIdResponse } from '../../../models/event';

interface ConfirmationPayProps {
  eventId?: string;
  closeModal: () => void;
}

export default function PendingApprovalWarning(props: ConfirmationPayProps) {
  const lang = useTranslation('event');
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventByIdResponse | null>(null);

  function goToEvent(eventId?: string): void {
    navigate(`/event/${eventId}`);
  }

  useEffect(() => {
    if (props.eventId) {
      getEventById(props.eventId)
        .then(res => setEvent(res))
        .catch(e => console.error(e));
    }
  }, [props.eventId]);

  return (
    <div className={styles.popupContainer}>
      <p className={styles.popupTitle}>{lang.pendingTransferWarning}</p>
      <p className={styles.eventName}>{event?.title}</p>
      <div className={styles.btnSection}>
        <Button
          className={styles.goToEventBtn}
          kind="whitePrimary"
          size="short"
          onClick={() => goToEvent(props.eventId)}
        >
          {lang.goToEvent}
        </Button>
      </div>
    </div>
  );
}