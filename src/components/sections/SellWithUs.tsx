import { useEffect, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import gsap from 'gsap';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { z } from 'zod';
import type { SellFormValues } from '../../types';
import { GradientBlob } from '../ui/GradientBlob';
import { MagneticButton } from '../ui/MagneticButton';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(6, 'Phone is required'),
  propertyType: z.enum(['apartment', 'house', 'land', 'commercial']),
  estimatedValue: z.string().min(1, 'Estimated value is required'),
  message: z.string().min(10, 'Please add a short message'),
});

const Section = styled.section`
  position: relative;
  padding: ${({ theme }) => theme.spacing.sectionY} ${({ theme }) => theme.spacing.pageX};
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 40%, rgba(59, 91, 219, 0.28), transparent 45%),
    linear-gradient(180deg, rgba(0, 10, 103, 0.85) 0%, ${({ theme }) => theme.colors.deepBlack} 100%);
`;

const Inner = styled.div`
  position: relative;
  z-index: 2;
  display: grid;
  gap: clamp(40px, 6vw, 72px);

  @media (min-width: 900px) {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }
`;

const Headline = styled.h2`
  max-width: 12ch;
  font-family: ${({ theme }) => theme.typography.display};
  font-size: clamp(40px, 5vw, 72px);
  font-weight: ${({ theme }) => theme.typography.weights.regular};
  line-height: 1.02;
`;

const Form = styled.form`
  display: grid;
  gap: 28px;
`;

const Field = styled.label`
  position: relative;
  display: grid;
  gap: 8px;
`;

const FieldLabel = styled.span<{ $active?: boolean }>`
  color: ${({ $active, theme }) => ($active ? theme.colors.gold : 'rgba(245,245,240,0.55)')};
  font-size: ${({ theme }) => theme.typography.scale.label};
  letter-spacing: ${({ theme }) => theme.typography.tracking.label};
  text-transform: uppercase;
  transform: translateY(${({ $active }) => ($active ? 0 : '18px')});
  transition: color 0.25s ease, transform 0.25s ease;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 0 12px;
  border: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  color: ${({ theme }) => theme.colors.white};
  outline: none;

  &:focus {
    border-bottom-color: ${({ theme }) => theme.colors.gold};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 0 12px;
  border: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  color: ${({ theme }) => theme.colors.white};
  outline: none;

  &:focus {
    border-bottom-color: ${({ theme }) => theme.colors.gold};
  }

  option {
    color: ${({ theme }) => theme.colors.deepBlack};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 10px 0 12px;
  border: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  color: ${({ theme }) => theme.colors.white};
  outline: none;
  resize: vertical;

  &:focus {
    border-bottom-color: ${({ theme }) => theme.colors.gold};
  }
`;

const ErrorText = styled.span`
  color: #e8b35a;
  font-size: 12px;
`;

const Success = styled.p`
  color: ${({ theme }) => theme.colors.gold};
  font-size: 14px;
  letter-spacing: 0.08em;
`;

export function SellWithUs() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<SellFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      propertyType: 'apartment',
    },
  });

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const fields = section.querySelectorAll('input, select, textarea');

    fields.forEach((field) => {
      const onFocus = () => {
        gsap.to(field, {
          borderBottomColor: '#C8A96E',
          duration: 0.35,
          ease: 'power2.out',
        });
      };

      const onBlur = () => {
        gsap.to(field, {
          borderBottomColor: 'rgba(255,255,255,0.2)',
          duration: 0.35,
          ease: 'power2.out',
        });
      };

      field.addEventListener('focus', onFocus);
      field.addEventListener('blur', onBlur);
    });
  }, []);

  const onSubmit = (values: SellFormValues) => {
    console.info('Sell inquiry submitted', values);
    reset();
  };

  return (
    <Section id="sell-with-us" ref={sectionRef}>
      <GradientBlob color="rgba(26, 47, 160, 0.55)" left="72%" opacity={0.5} size="clamp(280px, 40vw, 560px)" top="12%" />
      <Inner>
        <Headline>List your property with us</Headline>
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Field>
            <FieldLabel $active>Name</FieldLabel>
            <Input {...register('name')} />
            {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
          </Field>
          <Field>
            <FieldLabel $active>Email</FieldLabel>
            <Input type="email" {...register('email')} />
            {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
          </Field>
          <Field>
            <FieldLabel $active>Phone</FieldLabel>
            <Input type="tel" {...register('phone')} />
            {errors.phone && <ErrorText>{errors.phone.message}</ErrorText>}
          </Field>
          <Field>
            <FieldLabel $active>Property type</FieldLabel>
            <Select {...register('propertyType')}>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
            </Select>
          </Field>
          <Field>
            <FieldLabel $active>Estimated value</FieldLabel>
            <Input {...register('estimatedValue')} />
            {errors.estimatedValue && <ErrorText>{errors.estimatedValue.message}</ErrorText>}
          </Field>
          <Field>
            <FieldLabel $active>Message</FieldLabel>
            <Textarea {...register('message')} />
            {errors.message && <ErrorText>{errors.message.message}</ErrorText>}
          </Field>
          <MagneticButton type="submit">Submit inquiry</MagneticButton>
          {isSubmitSuccessful && <Success>Thank you. Our team will contact you shortly.</Success>}
        </Form>
      </Inner>
    </Section>
  );
}
