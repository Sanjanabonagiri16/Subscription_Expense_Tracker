-- Seed data for the subscription management system

-- Subscription Plans
insert into public.subscription_plans (name, price, billing_period, features) values
  ('Basic', 29, 'monthly', '["Basic Analytics", "Up to 1,000 subscribers", "Email Support"]'),
  ('Professional', 79, 'monthly', '["Advanced Analytics", "Up to 10,000 subscribers", "Priority Support", "Custom Branding"]'),
  ('Enterprise', 199, 'monthly', '["Enterprise Analytics", "Unlimited subscribers", "24/7 Phone Support", "Custom Branding", "API Access"]');

-- Sample Revenue Metrics
insert into public.revenue_metrics (mrr, arr, churn_rate, arpu, ltv, revenue_by_plan, historical_revenue, timeframe) values
  (10500, 126000, 2.4, 85, 1250, 
   '{"Basic": 2500, "Professional": 5000, "Enterprise": 3000}',
   '[{"date": "2024-01", "revenue": 5000, "newSubscribers": 10, "churnedSubscribers": 2},
     {"date": "2024-02", "revenue": 7500, "newSubscribers": 15, "churnedSubscribers": 3},
     {"date": "2024-03", "revenue": 10000, "newSubscribers": 20, "churnedSubscribers": 5}]',
   'month');
