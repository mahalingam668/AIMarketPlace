import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { X, Save } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../../store';
import { updateProfile } from '../../../store/slices/freelancerSlice';

const profileSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters').max(60, 'Name is too long'),
  title: z.string().min(5, 'Add a more descriptive title').max(100, 'Title is too long'),
  bio: z.string().min(20, 'Bio should be at least 20 characters').max(600, 'Bio is too long'),
  hourlyRate: z.coerce.number().min(5, 'Minimum rate is $5/hr').max(1000, 'Maximum rate is $1000/hr'),
  location: z.string().min(2, 'Location is required'),
  available: z.boolean(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function FreelancerProfilePage() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((s) => s.freelancer.profile);
  const [skills, setSkills] = useState<string[]>(profile.skills);
  const [skillInput, setSkillInput] = useState('');
  const [justSaved, setJustSaved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: profile.displayName,
      title: profile.title,
      bio: profile.bio,
      hourlyRate: profile.hourlyRate,
      location: profile.location,
      available: profile.available,
    },
  });

  const addSkill = () => {
    const value = skillInput.trim();
    if (value && !skills.includes(value)) {
      setSkills((prev) => [...prev, value]);
    }
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const onSubmit = (values: ProfileFormValues) => {
    dispatch(
      updateProfile({
        ...values,
        skills,
        languages: profile.languages,
      })
    );
    toast.success('Profile updated successfully.');
    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 3000);
  };

  return (
    <div>
      <div className="fl-header">
        <div>
          <h1 className="fl-header__title">Profile</h1>
          <p className="fl-header__subtitle">This is what buyers see when they view your public profile.</p>
        </div>
      </div>

      <form className="fl-section" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="fl-section__header">
          <h3 className="fl-section__title">Basic Information</h3>
        </div>

        <div className="fl-form-grid">
          <div className="fl-form-field">
            <label htmlFor="displayName">Display Name</label>
            <input id="displayName" type="text" {...register('displayName')} />
            {errors.displayName && <span className="fl-form-field__error">{errors.displayName.message}</span>}
          </div>

          <div className="fl-form-field">
            <label htmlFor="hourlyRate">Hourly Rate (USD)</label>
            <input id="hourlyRate" type="number" step="1" {...register('hourlyRate')} />
            {errors.hourlyRate && <span className="fl-form-field__error">{errors.hourlyRate.message}</span>}
          </div>

          <div className="fl-form-field fl-form-field--full">
            <label htmlFor="title">Professional Title</label>
            <input id="title" type="text" placeholder="e.g. Full-Stack Integration Developer" {...register('title')} />
            {errors.title && <span className="fl-form-field__error">{errors.title.message}</span>}
          </div>

          <div className="fl-form-field fl-form-field--full">
            <label htmlFor="bio">Bio</label>
            <textarea id="bio" {...register('bio')} />
            {errors.bio && <span className="fl-form-field__error">{errors.bio.message}</span>}
          </div>

          <div className="fl-form-field">
            <label htmlFor="location">Location</label>
            <input id="location" type="text" {...register('location')} />
            {errors.location && <span className="fl-form-field__error">{errors.location.message}</span>}
          </div>

          <div className="fl-form-field">
            <label htmlFor="available">Availability</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-primary)' }}>
              <input id="available" type="checkbox" style={{ width: 'auto' }} {...register('available')} />
              Currently available for new work
            </label>
          </div>

          <div className="fl-form-field fl-form-field--full">
            <label htmlFor="skill-input">Skills</label>
            <div className="fl-chip-input">
              {skills.map((skill) => (
                <span key={skill} className="fl-chip">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} aria-label={`Remove ${skill}`}>
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                id="skill-input"
                type="text"
                placeholder="Add a skill and press Enter"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                onBlur={addSkill}
              />
            </div>
          </div>
        </div>

        <div className="fl-form-actions">
          <button type="submit" className="fl-btn fl-btn--primary" disabled={isSubmitting}>
            <Save size={14} /> Save Changes
          </button>
          {justSaved && <span className="fl-save-confirmation">Saved</span>}
        </div>
      </form>
    </div>
  );
}

export default FreelancerProfilePage;
