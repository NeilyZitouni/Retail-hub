
const welcomeEmailTemplate = (userEmail, userName = 'Valued Customer') => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to RetailHub</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333333;
                background-color: #f8f9fa;
            }
            
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
            }
            
            .logo {
                font-size: 32px;
                font-weight: bold;
                margin-bottom: 10px;
                letter-spacing: -1px;
            }
            
            .header-subtitle {
                font-size: 16px;
                opacity: 0.9;
                font-weight: 300;
            }
            
            .content {
                padding: 40px 30px;
            }
            
            .welcome-message {
                font-size: 24px;
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 20px;
                text-align: center;
            }
            
            .message-body {
                font-size: 16px;
                line-height: 1.8;
                color: #555555;
                margin-bottom: 30px;
            }
            
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 50px;
                font-weight: 600;
                font-size: 16px;
                text-align: center;
                transition: transform 0.3s ease;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            }
            
            .cta-container {
                text-align: center;
                margin: 30px 0;
            }
            
            .features {
                background-color: #f8f9fa;
                padding: 25px;
                border-radius: 8px;
                margin: 25px 0;
            }
            
            .features-title {
                font-size: 18px;
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 15px;
                text-align: center;
            }
            
            .feature-list {
                list-style: none;
                padding: 0;
            }
            
            .feature-item {
                padding: 8px 0;
                border-bottom: 1px solid #e9ecef;
                display: flex;
                align-items: center;
            }
            
            .feature-item:last-child {
                border-bottom: none;
            }
            
            .feature-icon {
                color: #667eea;
                margin-right: 12px;
                font-weight: bold;
            }
            
            .footer {
                background-color: #2c3e50;
                color: #ecf0f1;
                padding: 30px;
                text-align: center;
            }
            
            .footer-content {
                font-size: 14px;
                line-height: 1.6;
            }
            
            .social-links {
                margin: 20px 0;
            }
            
            .social-links a {
                color: #3498db;
                text-decoration: none;
                margin: 0 15px;
                font-weight: 500;
            }
            
            .unsubscribe {
                font-size: 12px;
                color: #95a5a6;
                margin-top: 20px;
            }
            
            .unsubscribe a {
                color: #3498db;
                text-decoration: none;
            }
            
            @media (max-width: 600px) {
                .email-container {
                    margin: 0;
                    border-radius: 0;
                }
                
                .header, .content, .footer {
                    padding: 25px 20px;
                }
                
                .welcome-message {
                    font-size: 20px;
                }
                
                .message-body {
                    font-size: 14px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <!-- Header -->
            <div class="header">
                <div class="logo">RetailHub</div>
                <div class="header-subtitle">Your Ultimate Shopping Destination</div>
            </div>
            
            <!-- Main Content -->
            <div class="content">
                <h1 class="welcome-message">Welcome to RetailHub!</h1>
                
                <div class="message-body">
                    <p>Dear ${userName},</p>
                    
                    <p>Thank you for joining RetailHub! We're thrilled to have you as part of our growing community of savvy shoppers. Your account has been successfully created and you're now ready to explore thousands of premium products at unbeatable prices.</p>
                    
                    <p>Get ready to discover exclusive deals, personalized recommendations, and a seamless shopping experience tailored just for you.</p>
                </div>
                
                <div class="cta-container">
                    <a href="${process.env.FRONTEND_URL || 'https://retailhub.com'}" class="cta-button">Start Shopping Now</a>
                </div>
                
                <!-- Features Section -->
                <div class="features">
                    <h2 class="features-title">What's waiting for you:</h2>
                    <ul class="feature-list">
                        <li class="feature-item">
                            <span class="feature-icon">✓</span>
                            <span>Exclusive member-only discounts and flash sales</span>
                        </li>
                        <li class="feature-item">
                            <span class="feature-icon">✓</span>
                            <span>Free shipping on orders over $50</span>
                        </li>
                        <li class="feature-item">
                            <span class="feature-icon">✓</span>
                            <span>Personalized product recommendations</span>
                        </li>
                        <li class="feature-item">
                            <span class="feature-icon">✓</span>
                            <span>24/7 customer support and easy returns</span>
                        </li>
                        <li class="feature-item">
                            <span class="feature-icon">✓</span>
                            <span>Early access to new products and collections</span>
                        </li>
                    </ul>
                </div>
                
                <div class="message-body">
                    <p>If you have any questions or need assistance, our friendly support team is here to help. Simply reply to this email or visit our help center.</p>
                    
                    <p>Happy shopping!</p>
                    
                    <p><strong>The RetailHub Team</strong></p>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
                <div class="footer-content">
                    <p><strong>RetailHub Inc.</strong></p>
                    <p>123 Commerce Street, Business District</p>
                    <p>New York, NY 10001</p>
                    
                    <div class="social-links">
                        <a href="#">Facebook</a>
                        <a href="#">Twitter</a>
                        <a href="#">Instagram</a>
                        <a href="#">LinkedIn</a>
                    </div>
                    
                    <div class="unsubscribe">
                        <p>This email was sent to ${userEmail}</p>
                        <p>Don't want to receive these emails? <a href="#">Unsubscribe here</a></p>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
};

module.exports = {
  welcomeEmailTemplate
};