import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { z } from 'zod';
import { useLanguage } from '../../i18n/LanguageContext';
import type { WeBuyFormValues, WeBuyIntent } from '../../types';

const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';

const Form = styled.form`
  display: grid;
  gap: 28px;
`;

const IntentRow = styled.div`
  display: grid;
  gap: 10px;

  @media (min-width: 720px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const IntentButton = styled.button<{ $active?: boolean }>`
  position: relative;
  min-height: 56px;
  padding: 14px 16px;
  overflow: hidden;
  border: 1px solid
    ${({ $active, theme }) => ($active ? theme.colors.navy : theme.colors.brightLine)};
  background: ${({ $active }) => ($active ? 'rgba(0, 10, 103, 0.06)' : 'transparent')};
  color: ${({ theme }) => theme.colors.brightInk};
  font-size: 12px;
  letter-spacing: 0.12em;
  text-align: left;
  text-transform: uppercase;
  transition:
    border-color 200ms ${EASE},
    background 200ms ${EASE},
    transform 180ms ${EASE},
    color 180ms ${EASE};

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background: ${({ theme }) => theme.colors.navy};
    transform: scaleX(${({ $active }) => ($active ? 1 : 0)});
    transform-origin: 0 50%;
    transition: transform 280ms ${EASE};
  }

  &:hover {
    border-color: rgba(0, 10, 103, 0.4);
    transform: translateY(-2px);
  }

  &:hover::after {
    transform: scaleX(1);
  }

  &:active {
    transform: scale(0.97);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.navy};
    outline-offset: 3px;
  }
`;

const Field = styled.label`
  display: grid;
  gap: 8px;
`;

const FieldLabel = styled.span`
  color: ${({ theme }) => theme.colors.navy};
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 0;
  border: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.brightLine};
  background: transparent;
  color: ${({ theme }) => theme.colors.brightInk};
  outline: none;
  transition: border-color 180ms ${EASE};

  &:focus {
    border-bottom-color: ${({ theme }) => theme.colors.navy};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 0;
  border: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.brightLine};
  background: transparent;
  color: ${({ theme }) => theme.colors.brightInk};
  outline: none;

  &:focus {
    border-bottom-color: ${({ theme }) => theme.colors.navy};
  }

  option {
    color: ${({ theme }) => theme.colors.deepBlack};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 96px;
  padding: 12px 0;
  border: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.brightLine};
  background: transparent;
  color: ${({ theme }) => theme.colors.brightInk};
  outline: none;
  resize: vertical;

  &:focus {
    border-bottom-color: ${({ theme }) => theme.colors.navy};
  }
`;

const ErrorText = styled.span`
  color: #8a4b16;
  font-size: 12px;
`;

const Submit = styled.button`
  justify-self: start;
  min-height: 52px;
  padding: 0 28px;
  border: 0;
  background: ${({ theme }) => theme.colors.navy};
  color: ${({ theme }) => theme.colors.white};
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  transition: transform 160ms ${EASE}, opacity 180ms ${EASE};

  &:hover {
    opacity: 0.92;
  }

  &:active {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.5;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.navy};
    outline-offset: 3px;
  }
`;

const Note = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.brightMuted};
  font-size: 13px;
  line-height: 1.5;
`;

const Success = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.navy};
  font-size: 14px;
  letter-spacing: 0.06em;
`;

const INTENTS: WeBuyIntent[] = ['buy', 'list', 'unsure'];

type WeBuyIntakeProps = {
  initialIntent?: WeBuyIntent;
};

export function WeBuyIntake({ initialIntent = 'unsure' }: WeBuyIntakeProps) {
  const { t } = useLanguage();
  const [pending, setPending] = useState(false);

  const schema = useMemo(
    () =>
      z.object({
        intent: z.enum(['buy', 'list', 'unsure']),
        location: z.string().min(2, t.weBuyPage.validation.location),
        phone: z.string().min(6, t.weBuyPage.validation.phone),
        name: z.string().min(2, t.weBuyPage.validation.name),
        propertyType: z.enum(['apartment', 'house', 'land', 'commercial']),
        message: z.string(),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<WeBuyFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      intent: initialIntent,
      propertyType: 'apartment',
      message: '',
    },
  });

  const intent = watch('intent');

  const onSubmit = (values: WeBuyFormValues) => {
    setPending(true);
    const intentLabel = t.weBuyPage.intents[values.intent];
    const typeLabel = t.weBuyPage.propertyTypes[values.propertyType];
    const subject = encodeURIComponent(`Ouren — ${intentLabel} / ${values.location}`);
    const body = encodeURIComponent(
      [
        `Záměr: ${intentLabel}`,
        `Jméno: ${values.name}`,
        `Telefon: ${values.phone}`,
        `Lokalita: ${values.location}`,
        `Typ: ${typeLabel}`,
        values.message ? `Zpráva: ${values.message}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
    );
    window.location.href = `mailto:info@ouren.cz?subject=${subject}&body=${body}`;
    reset({
      intent: values.intent,
      propertyType: values.propertyType,
      location: '',
      phone: '',
      name: '',
      message: '',
    });
    setPending(false);
  };

  return (
    <Form id="we-buy-form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div>
        <FieldLabel as="p">{t.weBuyPage.fields.intent}</FieldLabel>
        <IntentRow role="group" aria-label={t.weBuyPage.fields.intent}>
          {INTENTS.map((key) => (
            <IntentButton
              $active={intent === key}
              key={key}
              onClick={() => setValue('intent', key, { shouldDirty: true })}
              type="button"
            >
              {t.weBuyPage.intents[key]}
            </IntentButton>
          ))}
        </IntentRow>
        <input type="hidden" {...register('intent')} />
      </div>

      <Field>
        <FieldLabel>{t.weBuyPage.fields.location}</FieldLabel>
        <Input autoComplete="address-level2" {...register('location')} />
        {errors.location ? <ErrorText>{errors.location.message}</ErrorText> : null}
      </Field>

      <Field>
        <FieldLabel>{t.weBuyPage.fields.phone}</FieldLabel>
        <Input autoComplete="tel" type="tel" {...register('phone')} />
        {errors.phone ? <ErrorText>{errors.phone.message}</ErrorText> : null}
      </Field>

      <Field>
        <FieldLabel>{t.weBuyPage.fields.name}</FieldLabel>
        <Input autoComplete="name" {...register('name')} />
        {errors.name ? <ErrorText>{errors.name.message}</ErrorText> : null}
      </Field>

      <Field>
        <FieldLabel>{t.weBuyPage.fields.propertyType}</FieldLabel>
        <Select {...register('propertyType')}>
          <option value="apartment">{t.weBuyPage.propertyTypes.apartment}</option>
          <option value="house">{t.weBuyPage.propertyTypes.house}</option>
          <option value="land">{t.weBuyPage.propertyTypes.land}</option>
          <option value="commercial">{t.weBuyPage.propertyTypes.commercial}</option>
        </Select>
      </Field>

      <Field>
        <FieldLabel>{t.weBuyPage.fields.message}</FieldLabel>
        <Textarea {...register('message')} />
      </Field>

      <Submit disabled={pending} type="submit">
        {t.weBuyPage.submit}
      </Submit>
      <Note>{t.weBuyPage.formNote}</Note>
      {isSubmitSuccessful ? <Success>{t.weBuyPage.success}</Success> : null}
    </Form>
  );
}
