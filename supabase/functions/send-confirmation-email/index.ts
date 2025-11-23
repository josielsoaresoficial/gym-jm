import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const hookSecret = Deno.env.get("SEND_EMAIL_HOOK_SECRET") as string;

const handler = async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers);
    
    // Validar webhook do Supabase
    const wh = new Webhook(hookSecret);
    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type },
    } = wh.verify(payload, headers) as {
      user: {
        email: string;
      };
      email_data: {
        token: string;
        token_hash: string;
        redirect_to: string;
        email_action_type: string;
        site_url: string;
      };
    };

    console.log("Webhook validado. Enviando email para:", user.email);

    // Construir URL de confirmação
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const confirmationUrl = `${supabaseUrl}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`;

    // Enviar email de confirmação
    const emailResponse = await resend.emails.send({
      from: "nPnG JM <onboarding@resend.dev>",
      to: [user.email],
      subject: "Confirme seu cadastro - nPnG JM",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirme seu cadastro</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; background-color: #0a0a0a;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <div style="background: linear-gradient(135deg, #10b981 0%, #f59e0b 100%); padding: 40px; border-radius: 16px; text-align: center;">
                <h1 style="color: #ffffff; font-size: 32px; margin: 0 0 16px 0; font-weight: bold;">
                  nPnG <span style="background: linear-gradient(to right, #fbbf24, #f97316); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">JM</span>
                </h1>
                <p style="color: rgba(255, 255, 255, 0.9); font-size: 18px; margin: 0;">
                  Seu personal trainer e nutricionista com IA
                </p>
              </div>
              
              <div style="background-color: #1a1a1a; padding: 40px; border-radius: 16px; margin-top: 24px;">
                <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 16px 0;">Bem-vindo!</h2>
                <p style="color: rgba(255, 255, 255, 0.8); font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                  Estamos felizes por ter você conosco! Para começar sua jornada fitness, precisamos confirmar seu endereço de email.
                </p>
                
                <div style="text-align: center; margin: 32px 0;">
                  <a href="${confirmationUrl}" 
                     style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #f59e0b 100%); color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                    Confirmar Email
                  </a>
                </div>
                
                <p style="color: rgba(255, 255, 255, 0.6); font-size: 14px; line-height: 1.6; margin: 24px 0 0 0;">
                  Ou copie e cole este link no seu navegador:<br>
                  <span style="color: #10b981; word-break: break-all;">${confirmationUrl}</span>
                </p>
                
                <p style="color: rgba(255, 255, 255, 0.6); font-size: 14px; margin: 32px 0 0 0; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                  Se você não criou uma conta, pode ignorar este email com segurança.
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 24px;">
                <p style="color: rgba(255, 255, 255, 0.4); font-size: 12px; margin: 0;">
                  © 2025 nPnG JM. Todos os direitos reservados.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Email enviado com sucesso:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Erro ao enviar email:", error);
    return new Response(
      JSON.stringify({ 
        error: {
          http_code: error.code,
          message: error.message 
        }
      }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
