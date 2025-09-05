import { useState } from 'react';
import FoodSurvey from './FoodSurvey';
import { eventWithOptionsMock } from '../../../mocks/eventWithOptions';
import { IOption } from '../../../models/options';

// durante el mock, forzá a que FoodSurvey use el service.mock si querés ver add/edit/delete
// import * as OptionsSvc from '@/service/optionsService.mock'; // (opcional)

export default function FoodSurveyPlayground() {
  const event = eventWithOptionsMock;
  const userId = event.members[0]._id; // simulamos usuario logueado

  const [options, setOptions] = useState<IOption[]>(event.options);

  return (
    <div style={{ padding: 24, maxWidth: 720 }}>
      <FoodSurvey
        eventId={event._id}
        userId={userId}
        options={options}                      // 👈 la UI usa solo esto
        participantsCount={event.members.length} // solo para max del range
        onOptionsChange={setOptions}           // ver cambios en vivo
      />
    </div>
  );
}
