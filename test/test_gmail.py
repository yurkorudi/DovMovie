import yagmail

gm = yagmail.SMTP('lviv.dovzhenkocinema@gmail.com', 'sefp vmne atyf mxqv')


def send_dovzhenko_ticket_email(recipient, movie_title, session_datetime, sender_email=None, sender_password=None):
    global gm
    
    # Аргументи:
    #     recipient (str): email одержувача
    #     movie_title (str): назва фільму
    #     session_datetime (str): дата та час сеансу
    #     pdf_file_path (str): шлях до PDF-файлу з квитками
    #     sender_email (str): email відправника
    #     sender_password (str): пароль відправника

    

    html_content = f"""\
<!doctype html>
<html lang="uk">
  <body style="margin:0;padding:0;background-color:#0A1A2F;font-family:Arial,Helvetica,sans-serif;color:#333;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
            


            <tr>
              <td style="background:#111; padding:24px 28px; text-align:center;">
                <div style="color:#fff; font-size:20px; font-weight:600;">
                  DovzhenkoКіно — Квиток
                </div>
              </td>
            </tr>
            
            <tr>
              <td style="padding:28px;">
                <h2 style="margin:0 0 16px 0; font-size:22px; color:#e53935;">Ваш квиток на фільм</h2>
                
                <div style="font-size:18px; margin-bottom:12px; color:#222;">
                  <strong>Фільм:</strong> {movie_title}
                </div>
                <div style="font-size:16px; margin-bottom:20px; color:#555;">
                  <strong>Сеанс:</strong> {session_datetime}
                </div>
                
                <div style="font-size:14px; color:#444; line-height:1.5;">
                  Ми раді вітати вас у Dovzhenko Center — культурному просторі кіно, музики та мистецтва.
                  <br><br>
                  Якщо ви не очікували цей лист або маєте запитання, зверніться до нас за адресою:
                  <a href="mailto:lviv.dovzhenkocentre@gmail.com" style="color:#e53935; text-decoration:none;">lviv.dovzhenkocentre@gmail.com</a>.
                </div>
              </td>
            </tr>

            <!-- Футер -->
            <tr>
              <td style="background:#111; padding:18px 28px; text-align:center; color:#bbb; font-size:13px;">
                © {2025} Dovzhenko Center — проспект Червоної Калини 81, Львів<br>
                Телефон: +380 (96) 825 83 60 <br>
                Сайт: <a href="https://www.dovzhenko-center.lviv.ua/en" style="color:#bbb; text-decoration:none;">https://www.dovzhenko-center.lviv.ua/en</a>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
"""
    

        

    gm.send(
        to=recipient,
        subject=f"🎬 Квитки на фільм '{movie_title}' - Dovzhenko Center",
        contents=html_content
    )
    
    print(f"✅ Лист з квитками успішно надіслано до {recipient}")
    return True
        



send_dovzhenko_ticket_email(
    recipient="yurkorudi@gmail.com",
    movie_title="Земля",
    session_datetime="15 грудня 2024, 19:00")