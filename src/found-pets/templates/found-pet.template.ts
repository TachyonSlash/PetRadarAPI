import { FoundPetCDto } from 'src/core/models/foundPet.model';
import { LostPetCDto } from 'src/core/models/lostPet.model';
import { PetSpecies } from 'src/core/enums/pet-species.enum';
import { PetSize } from 'src/core/enums/pet-size.enum';
import { generateMatchMapboxStaticImage } from '../utils/utils';

const speciesLabels: Record<PetSpecies, { label: string; emoji: string }> = {
  [PetSpecies.DOG]: { label: 'Perro', emoji: '🐶' },
  [PetSpecies.CAT]: { label: 'Gato', emoji: '🐱' },
  [PetSpecies.BIRD]: { label: 'Ave', emoji: '🐦' },
  [PetSpecies.SNAKE]: { label: 'Serpiente', emoji: '🐍' },
  [PetSpecies.FISH]: { label: 'Pez', emoji: '🐠' },
  [PetSpecies.REPTILE]: { label: 'Reptil', emoji: '🦎' },
  [PetSpecies.OTHER]: { label: 'Otro', emoji: '🐾' },
};

const sizeLabels: Record<PetSize, string> = {
  [PetSize.XS]: 'Muy pequeño',
  [PetSize.SMALL]: 'Pequeño',
  [PetSize.MEDIUM]: 'Mediano',
  [PetSize.LARGE]: 'Grande',
};

export const generateFoundPetEmailTemplate = (
  foundPet: FoundPetCDto,
  lostPet: LostPetCDto,
): string => {
    const mapUrl = generateMatchMapboxStaticImage(
    lostPet.lat,
    lostPet.lon,
    foundPet.lat,
    foundPet.lon,
  );
  const speciesInfo = speciesLabels[foundPet.species] ?? {
    label: 'Mascota',
    emoji: '🐾',
  };

  const sizeLabel = sizeLabels[foundPet.size] ?? 'Desconocido';

  const foundDate = new Date(foundPet.found_date).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const lostDate = new Date(lostPet.lost_date).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
  <div style="margin:0;padding:0;background-color:#f0f2f5;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f2f5;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

            <tr>
              <td style="background:linear-gradient(135deg,#1b4332 0%,#2d6a4f 50%,#52b788 100%);padding:32px 32px 24px;text-align:center;">
                <p style="margin:0 0 8px;font-size:14px;color:#d8f3dc;text-transform:uppercase;letter-spacing:2px;font-weight:600;">Posible coincidencia de mascota</p>
                <h1 style="margin:0;font-size:26px;color:#ffffff;font-weight:700;line-height:1.3;">${lostPet.name}, encontramos una mascota parecida</h1>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 32px 0;text-align:center;">
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                  <tr>
                    <td style="background-color:#d8f3dc;border-radius:24px;padding:8px 20px;">
                      <span style="font-size:18px;vertical-align:middle;">${speciesInfo.emoji}</span>
                      <span style="font-size:14px;font-weight:600;color:#1b4332;vertical-align:middle;margin-left:6px;">${speciesInfo.label}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            ${foundPet.photo_url ? `
            <tr>
              <td style="padding:24px 32px 0;">
                <img
                  src="${foundPet.photo_url}"
                  width="456"
                  style="width:100%;height:auto;border-radius:12px;display:block;object-fit:cover;"
                  alt="Foto de la mascota encontrada"
                />
              </td>
            </tr>` : ''}

            <tr>
              <td style="padding:24px 32px 0;">
                <p style="margin:0 0 12px;font-size:13px;color:#718096;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Datos de la mascota encontrada</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="50%" style="padding-right:8px;padding-bottom:12px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7fafc;border-radius:10px;">
                        <tr>
                          <td style="padding:12px 16px;">
                            <p style="margin:0 0 2px;font-size:11px;color:#a0aec0;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Especie</p>
                            <p style="margin:0;font-size:15px;color:#2d3748;font-weight:700;">${speciesInfo.label}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td width="50%" style="padding-left:8px;padding-bottom:12px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7fafc;border-radius:10px;">
                        <tr>
                          <td style="padding:12px 16px;">
                            <p style="margin:0 0 2px;font-size:11px;color:#a0aec0;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Tamaño</p>
                            <p style="margin:0;font-size:15px;color:#2d3748;font-weight:700;">${sizeLabel}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td width="50%" style="padding-right:8px;padding-bottom:12px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7fafc;border-radius:10px;">
                        <tr>
                          <td style="padding:12px 16px;">
                            <p style="margin:0 0 2px;font-size:11px;color:#a0aec0;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Color</p>
                            <p style="margin:0;font-size:15px;color:#2d3748;font-weight:700;">${foundPet.color}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td width="50%" style="padding-left:8px;padding-bottom:12px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7fafc;border-radius:10px;">
                        <tr>
                          <td style="padding:12px 16px;">
                            <p style="margin:0 0 2px;font-size:11px;color:#a0aec0;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Raza</p>
                            <p style="margin:0;font-size:15px;color:#2d3748;font-weight:700;">${foundPet.breed || 'No identificada'}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td colspan="2">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7fafc;border-radius:10px;">
                        <tr>
                          <td style="padding:12px 16px;">
                            <p style="margin:0 0 2px;font-size:11px;color:#a0aec0;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Descripción</p>
                            <p style="margin:0;font-size:15px;line-height:1.6;color:#2d3748;font-weight:600;">${foundPet.description}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 32px 0;">
                <hr style="border:none;border-top:1px solid #e2e8f0;margin:0;" />
              </td>
            </tr>

            <tr>
              <td style="padding:24px 32px 0;">
                <p style="margin:0 0 12px;font-size:13px;color:#718096;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Datos de contacto de quien la encontró</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-bottom:8px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7fafc;border-radius:10px;">
                        <tr>
                          <td style="padding:12px 16px;">
                            <p style="margin:0 0 2px;font-size:11px;color:#a0aec0;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Nombre</p>
                            <p style="margin:0;font-size:15px;color:#2d3748;font-weight:700;">${foundPet.finder_name}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:8px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7fafc;border-radius:10px;">
                        <tr>
                          <td style="padding:12px 16px;">
                            <p style="margin:0 0 2px;font-size:11px;color:#a0aec0;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Correo</p>
                            <p style="margin:0;font-size:15px;color:#2d3748;font-weight:700;">${foundPet.finder_email}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7fafc;border-radius:10px;">
                        <tr>
                          <td style="padding:12px 16px;">
                            <p style="margin:0 0 2px;font-size:11px;color:#a0aec0;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Teléfono</p>
                            <p style="margin:0;font-size:15px;color:#2d3748;font-weight:700;">${foundPet.finder_phone}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 32px 0;">
                <hr style="border:none;border-top:1px solid #e2e8f0;margin:0;" />
              </td>
            </tr>

            <tr>
              <td style="padding:24px 32px 0;">
                <p style="margin:0 0 12px;font-size:13px;color:#718096;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Mapa estático</p>
                <img
                  src="${mapUrl}"
                  width="456"
                  style="width:100%;height:auto;border-radius:12px;display:block;"
                  alt="Mapa con punto de pérdida y punto de hallazgo"
                />
              </td>
            </tr>

            <tr>
              <td style="padding:16px 32px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="50%" style="padding-right:8px;vertical-align:top;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fff5f5;border-radius:10px;">
                        <tr>
                          <td style="padding:12px 16px;">
                            <p style="margin:0 0 2px;font-size:11px;color:#a0aec0;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Mascota perdida</p>
                            <p style="margin:0 0 6px;font-size:15px;color:#2d3748;font-weight:700;">${lostPet.name}</p>
                            <p style="margin:0 0 4px;font-size:13px;color:#4a5568;">📍 ${lostPet.address}</p>
                            <p style="margin:0;font-size:13px;color:#4a5568;">Fecha: ${lostDate}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td width="50%" style="padding-left:8px;vertical-align:top;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fff4;border-radius:10px;">
                        <tr>
                          <td style="padding:12px 16px;">
                            <p style="margin:0 0 2px;font-size:11px;color:#a0aec0;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Mascota encontrada</p>
                            <p style="margin:0 0 6px;font-size:15px;color:#2d3748;font-weight:700;">${foundPet.address}</p>
                            <p style="margin:0 0 4px;font-size:13px;color:#4a5568;">Lat: ${foundPet.lat}</p>
                            <p style="margin:0;font-size:13px;color:#4a5568;">Lng: ${foundPet.lon}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 32px 0;">
                <hr style="border:none;border-top:1px solid #e2e8f0;margin:0;" />
              </td>
            </tr>

            <tr>
              <td style="padding:24px 32px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#edf2f7;border-radius:12px;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <p style="margin:0 0 8px;font-size:13px;color:#4a5568;font-weight:700;">Resumen</p>
                      <p style="margin:0;font-size:14px;line-height:1.6;color:#4a5568;">
                        Se registró una mascota encontrada con características similares a la mascota reportada como perdida.
                        Revisa la información de contacto para comunicarte con la persona que la encontró.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:0 32px 32px;text-align:center;">
                <p style="margin:0;font-size:12px;color:#a0aec0;">Este correo fue generado automáticamente por el sistema Pet Radar.</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
  `;
};