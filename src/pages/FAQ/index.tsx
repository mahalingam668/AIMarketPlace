import { Link } from 'react-router-dom';
import * as Accordion from '@radix-ui/react-accordion';
import { HelpCircle, ChevronDown } from 'lucide-react';
import './FAQ.css';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqGroup {
  key: string;
  title: string;
  items: FaqItem[];
}

const FAQ_GROUPS: FaqGroup[] = [
  {
    key: 'buyers',
    title: 'Hiring on YAKKAY',
    items: [
      {
        question: "What's the difference between Basic, Standard, and Premium packages?",
        answer:
          "Every gig on YAKKAY is structured into up to three packages set by the seller. Basic usually covers a single, focused deliverable at the fastest price point. Standard typically adds scope, extra revisions, or a faster turnaround. Premium is the full-service tier — the most revisions, the broadest scope, and often priority delivery. Each package lists its own price, delivery time, and revision count on the gig page, so you can compare them side by side before ordering. If none of the three tiers fit, you can message the seller or post a project brief instead.",
      },
      {
        question: "What happens if I'm not happy with the delivery?",
        answer:
          "You don't release payment on delivery alone — you review it first. If the work doesn't match the brief, request a revision directly in the order workspace, within the revision limit of the package you ordered. If the seller still can't get it to match what was agreed, either side can escalate to a dispute, and our Super Admin team will review the original brief, the delivered files, and the message history before deciding how the escrowed funds are handled.",
      },
      {
        question: 'How many revisions do I get?',
        answer:
          "It depends on the package you order — sellers set the revision count per tier (Basic, Standard, Premium), and it's always shown on the gig page before you buy. Every revision request is logged against the order, so both you and the seller have a clear, timestamped record of what was asked for and what was changed.",
      },
      {
        question: 'Can I hire the same developer again?',
        answer:
          "Yes. You can order directly from a seller's profile again, or message them about a new project before placing the order. Many sellers prioritize repeat clients, and your order history with them carries forward, so there's no need to re-explain context you've already covered on a past project.",
      },
    ],
  },
  {
    key: 'sellers',
    title: 'Selling on YAKKAY',
    items: [
      {
        question: 'When do I get paid as a seller?',
        answer:
          "As soon as the buyer approves your delivery, the funds that were held in escrow release to your balance, which you can then withdraw. If a buyer doesn't respond within the delivery/revision window and hasn't opened a dispute, the order auto-completes and payment releases the same way — you're never left waiting indefinitely for a client to click a button.",
      },
      {
        question: 'How do I get discovered by buyers looking for AI expertise?',
        answer:
          'Buyers find gigs by browsing categories — Chatbot Development, AI Content Generation, AI Video & Audio, Data Science, AI Consulting — or by searching keywords directly. A complete profile, clearly scoped packages, a fast response time, and strong reviews all improve where your gig surfaces in those results. Ranking rewards consistency more than any single order.',
      },
      {
        question: 'How do seller badges and levels work, and how do I move up?',
        answer:
          'Every seller starts as a New Seller. As you complete orders on time with strong ratings, you progress to Level 2, then Top Rated, based on your order volume, on-time delivery rate, and average review score over a rolling window. Verified Specialist sits alongside these tiers and requires identity verification plus a demonstrated track record in a specific AI domain, like chatbot engineering or applied data science. Higher tiers get more visibility in search and signal more trust to buyers evaluating your gig.',
      },
    ],
  },
  {
    key: 'trust',
    title: 'Trust, Escrow & Disputes',
    items: [
      {
        question: 'How does escrow protect my payment?',
        answer:
          "When you place an order, your payment is charged immediately but held in escrow — it is not sent to the seller. The seller can see the funds are secured, which is why they can start work right away, but nothing pays out until you review and approve the finished delivery. If the order never gets approved and no valid delivery is made, your payment isn't released to the seller.",
      },
      {
        question: 'How do I know a seller is trustworthy?',
        answer:
          "Check their trust badge first — New Seller, Level 2, Top Rated, or Verified Specialist — since each tier reflects a real, criteria-based track record rather than a self-reported claim. Then look at their overall rating, number of completed orders, and response time, all shown on their profile and gig pages. Combined with escrow protection on your order, this gives you a much clearer signal than a portfolio alone.",
      },
      {
        question: 'How do disputes get resolved?',
        answer:
          "Most disagreements get resolved directly between buyer and seller in the order workspace, since revisions and delivery terms are already spelled out on the package. If that doesn't work, either party can open a formal dispute. A Super Admin then reviews the order brief, the actual delivered files, and the full message history, and issues a binding decision — releasing the payout to the seller, refunding the buyer, or splitting the escrowed funds — based on what was agreed versus what was delivered.",
      },
    ],
  },
];

function FAQ() {
  return (
    <div className="faq">
      <section className="faq__hero">
        <span className="faq__eyebrow">FAQ</span>
        <h1>Frequently asked questions</h1>
        <p>
          Answers about hiring AI developers, selling AI services, and how escrow, badges, and disputes work on
          YAKKAY AI Line. Can't find what you need? <Link to="/contact">Contact us</Link>.
        </p>
      </section>

      {FAQ_GROUPS.map((group) => (
        <section key={group.key} className="faq__group">
          <h2>{group.title}</h2>
          <Accordion.Root type="single" collapsible className="faq__accordion">
            {group.items.map((item, i) => (
              <Accordion.Item key={item.question} value={`${group.key}-${i}`} className="faq__item">
                <Accordion.Header>
                  <Accordion.Trigger className="faq__trigger">
                    <span>
                      <HelpCircle size={15} /> {item.question}
                    </span>
                    <ChevronDown size={15} className="faq__chevron" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="faq__content">{item.answer}</Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </section>
      ))}
    </div>
  );
}

export default FAQ;
