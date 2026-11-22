export const INITIAL_INQUIRIES = [
  {
    id: 'INQ-2026-089',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@apexpharma.in',
    phone: '+91 98401 24567',
    company: 'Apex BioTech Labs',
    service: 'Cleanroom HVAC Validation',
    subject: 'ISO Class 5 AHU Installation & Airflow Balancing',
    message:
      'We are expanding our sterile formulation wing at the Guindy Industrial Estate and require complete design, installation, and ISO Class 5 HEPA airflow qualification for two 1,200 sq. ft cleanroom suites. Please share your technical compliance brochure and schedule an on-site survey.',
    date: '21 Nov 2026',
    time: '04:15 PM',
    status: 'New',
  },
  {
    id: 'INQ-2026-088',
    name: 'Dr. Priya Sundaram',
    email: 'priya.sundaram@apollohospitals.org',
    phone: '+91 94440 98123',
    company: 'Apollo Specialty Clinic',
    service: 'Commercial Duct Cleaning',
    subject: 'Complete Operation Theatre & ICU Duct Sanitization',
    message:
      'Our hospital branch in Madipakkam is undergoing NABH accreditation re-audit next month. We need deep rotary-brush duct sanitization, microbial swab testing, and HEPA filter replacements across 4 operation theatres and the 12-bed ICU facility.',
    date: '21 Nov 2026',
    time: '11:30 AM',
    status: 'New',
  },
  {
    id: 'INQ-2026-087',
    name: 'Karthik Narayanan',
    email: 'karthik.n@solarisitparks.com',
    phone: '+91 98845 67210',
    company: 'Solaris IT Parks Chennai',
    service: 'Annual Maintenance Contract (AMC)',
    subject: 'Quarterly AMC for 450 TR Central Chiller Plant & AHUs',
    message:
      'Looking for a comprehensive annual maintenance contract covering 3 central screw chillers, 14 AHUs, and fresh air ventilation dampers across our 6-floor IT park in OMR. Would appreciate a meeting with your technical project lead this week.',
    date: '20 Nov 2026',
    time: '06:20 PM',
    status: 'New',
  },
  {
    id: 'INQ-2026-086',
    name: 'Ananya Deshmukh',
    email: 'ananya.deshmukh@greenleafhotels.com',
    phone: '+91 97890 54321',
    company: 'Greenleaf Luxury Suites',
    service: 'Industrial Kitchen Exhaust',
    subject: 'Heavy-Duty Commercial Kitchen Hood & Ecology Exhaust Unit',
    message:
      'We require replacement of our existing kitchen exhaust ducting with grease-rated fire-wrap ducts and an electrostatic precipitator (ESP) odor control unit to comply with local TNPCB environmental standards.',
    date: '20 Nov 2026',
    time: '02:05 PM',
    status: 'Read',
  },
  {
    id: 'INQ-2026-085',
    name: 'Dr. Vikram Mehta',
    email: 'vikram.mehta@genomedx.com',
    phone: '+91 99620 11984',
    company: 'GenoMed Diagnostics',
    service: 'Indoor Air Quality (IAQ) Testing',
    subject: 'Airborne Particulate Testing & Pressure Differential Audit',
    message:
      'We noticed minor pressure fluctuations between our PCR diagnostic room and adjacent corridors. Need your team to perform an airborne particulate counter check, pressure differential validation, and damper recalibration.',
    date: '19 Nov 2026',
    time: '09:40 AM',
    status: 'Read',
  },
  {
    id: 'INQ-2026-084',
    name: 'S. Suresh Kumar',
    email: 'suresh@arunachalamtextiles.co.in',
    phone: '+91 98410 33219',
    company: 'Arunachalam Textiles Ltd',
    service: 'Industrial Ventilation',
    subject: 'Humidification & High-Volume Exhaust Fans for Spinning Mill',
    message:
      'We need high-capacity axial flow exhaust fans and evaporative cooling humidification units for our yarn processing shed to maintain relative humidity between 65-70%. Requesting a site inspection.',
    date: '18 Nov 2026',
    time: '03:50 PM',
    status: 'Read',
  },
  {
    id: 'INQ-2026-083',
    name: 'Meera Krishnan',
    email: 'meera.krishnan@velsacademy.edu.in',
    phone: '+91 94451 88762',
    company: 'Vels International School',
    service: 'HVAC Air Purification',
    subject: 'Classroom Ventilation & UVGI Coil Disinfection Inquiry',
    message:
      'We are upgrading the indoor air safety standards across our kindergarten and primary campus blocks. Interested in installing UVGI (ultraviolet germicidal irradiation) in our duct coils and central fresh air units.',
    date: '17 Nov 2026',
    time: '12:10 PM',
    status: 'Read',
  },
  {
    id: 'INQ-2026-082',
    name: 'Divya Patel',
    email: 'divya.patel@chemtronics.org',
    phone: '+91 98840 77123',
    company: 'Chemtronics India',
    service: 'Cleanroom HVAC Validation',
    subject: 'Emergency Airflow Velocity & Smoke Pattern Test',
    message:
      'We require emergency visualization smoke pattern testing and air velocity profiling for our microelectronics cleanroom prior to European client inspection on Friday. Please confirm technician availability.',
    date: '16 Nov 2026',
    time: '10:00 AM',
    status: 'Read',
  },
]

const STORAGE_KEY = 'ventidy_admin_inquiries_demo'

export function getStoredInquiries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (err) {
    console.warn('Could not read inquiries from localStorage:', err)
  }
  return INITIAL_INQUIRIES
}

export function saveStoredInquiries(inquiries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inquiries))
  } catch (err) {
    console.warn('Could not save inquiries to localStorage:', err)
  }
}

export function resetStoredInquiries() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (err) {
    console.warn('Could not reset inquiries in localStorage:', err)
  }
  return INITIAL_INQUIRIES
}
