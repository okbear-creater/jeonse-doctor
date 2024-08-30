'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import styles from './page.module.css';

const SendIcon = ({ className }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isGreetingShown, setIsGreetingShown] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showExamples, setShowExamples] = useState(true);
  const [currentTypingMessage, setCurrentTypingMessage] = useState('');
  const [loadingDots, setLoadingDots] = useState('');
  const typingSpeed = 5;

  const examplePrompts = [
    "부동산이 경매에 넘어가면 보증금을 어떻게 받을 수 있나요?",
    "근저당이 설정된 집에서는 보증금을 돌려받기 어려울 수 있는 이유는 무엇인가요?",
    "전입신고를 하면 보증금에 어떤 법적 보호를 받게 되나요?",
    "우선 변제권이란 무엇인가요?",
    "전세권 설정의 효력은 언제부터 발생하나요?",
    "전세 보증 보험은 어떤 상황에서 보증금을 보호해주나요?",
  ];

  const basicTopics = [
    "전세계약의 절차와 주의사항은 무엇인가요?",
    "전세사기 유형별 정의는 무엇인가요?",
    "전세사기 유형별 예방법은 무엇인가요?",
  ];

  const predefinedAnswers = {
    "전세계약의 절차와 주의사항은 무엇인가요?": `
1. 문의 및 집 구경  
부동산 문의 후 원하는 집을 직접 방문하여 유사매물과 비교 및 검토합니다. 위치, 집 구조, 조건 등을 꼼꼼히 살펴보며 매매 시세를 확인합니다.

2. 방 선택  
선택한 집의 상태를 확인하고, 집주인 또는 부동산 중개인과 협의하여 임대 조건을 확정합니다. 이 단계에서 전입신고 가능 여부를 확인합니다.

3. 가계약  
거주인원, 흡연 여부등을 사전 고지하고, 계약금 일부를 송금하여 가계약을 체결합니다. 이 과정에서 선순위 권리, 임대인 신분증 확인, 본계약일, 잔금일 상태 확인 등이 필요합니다.

4. 본계약  
가계약에서 확인한 모든 사항을 다시 한 번 점검하고, 계약서를 작성합니다. 세부 특약사항등의 조건을 협의하고, 잔여 계약금 지급 및 계약금 영수증을 출력합니다.

5. 잔금  
잔금 전 전세대출 가능 여부/은행에 대출 실행 시간 / 선순위권리를 확인합니다. 잔금 송금 및 중개수수료를 납입하고, 비품 수령 및 관리비, 가스정산을 실시합니다. 잔금 지급이 완료되면 전입신고를 할 수 있으며, 부동산 거래 신고를 마무리합니다.

6. 입주  
전입신고와 함께 입주가 이루어집니다. (이때, 확정일자를 받아두는 것이 중요합니다.) 부동산 거래 신고를 진행합니다.

해당 가이드라인을 참고하여 전세계약 절차를 안전하게 진행할 수 있도록 준비하세요. 무엇보다 계약서 작성 시 모든 조건을 명확히 이해하고, 매물의 권리 상태와 임대인의 신분을 철저히 확인하는 것이 중요합니다.
`,
    "전세사기 유형별 정의는 무엇인가요?": `
1. 깡통전세  
   - 정의: 실제 시세보다 높은 가격으로 시세를 기재하고, 이에 맞추어 보증금을 요구하는 전세사기 유형입니다. 부동산 시세가 하락할 경우, 보증금을 돌려받지 못하게 되는 경우가 많습니다. 이는 보증금을 활용해 다른 부동산을 매수하고, 다시 전세를 설정하는 방식으로 진행되며, 결국 세입자는 보증금을 회수하지 못할 위험에 처합니다.

2. 이중 계약 / 중복 계약  
   - 정의:  
     - 이중 계약: 집주인이 대리인에게 월세 계약을 위임하였으나, 대리인이 이를 악용하여 월세 계약 대신 전세 계약을 체결하고 금액을 착복하는 유형입니다. 대리인은 관리 계약을 맺고 있으므로 집주인의 동의 없이도 임대차 계약을 체결할 수 있으며, 이후 돈을 챙기고 잠적하는 경우가 발생합니다.
     - 중복 계약: 동일한 부동산을 여러 세입자와 중복으로 계약을 체결하는 사기 유형으로, 각 세입자는 자신이 유일한 계약자라고 믿게 됩니다. 그러나 실제로는 복수의 세입자들이 동일한 부동산에 대한 권리를 주장하게 되어 피해가 발생합니다.

3. 불법 건축물 사기  
   - 정의: 주거용으로 허가받지 않은 건축물을 전세 주택으로 속여 계약하는 사기 유형입니다. 예를 들어, 고시원 같은 근린생활시설 등을 원룸이라 속여 계약 시, 용도 변경 사실이 발각되면 세입자는 퇴거 명령이나 철거에 직면하게 됩니다. 이 경우 전세 사기 피해자로도 인정받기 어려워지며 보증금을 돌려받지 못할 가능성이 커집니다. 이를 방지하기 위해서는 정부24에서 건축물 대장을 확인하는 것이 중요합니다.

4. 갭투자 사기  
   - 정의: 전세 세입자를 먼저 구하고 받은 전세 보증금을 기반으로 부동산을 매입한 후, 가격 상승을 기대하는 투자 방식입니다. 만약 부동산 가격이 하락할 경우, 집주인은 세입자에게 보증금을 돌려줄 수 없으며, 부동산이 경매로 넘어가게 됩니다. 경매 낙찰가가 떨어지면 근저당이 세입자보다 우선하게 되어 세입자는 손해를 보게 됩니다.

5. 신탁 사기  
   - 정의: 건물주가 건축 자금을 마련하기 위해 신탁회사에 소유권을 넘기고, 이를 통해 은행에서 대출을 받는 방식입니다. 신탁원부에 따르면, 건물주는 신탁회사의 동의 없이는 임대나 매매를 할 수 없습니다. 그러나 건물주가 신탁회사의 동의 없이 세입자와 임대 계약을 체결하고 보증금을 수령한 뒤 잠적하는 사기 유형입니다. 이 경우, 세입자는 임대차보호법의 보호를 받지 못하게 됩니다.

6. 대항력효력발생시점 악용 사기  
   - 정의: 전입신고 후 대항력과 우선변제권이 발생하기 전의 시점을 악용한 사기 유형입니다. 세입자가 전입신고를 마치고 확정일자를 받기 전까지는 무방비 상태에 놓이게 되는데, 집주인은 이 틈을 이용해 계약 당일 대출을 받아 근저당을 설정하고 잠적합니다. 이로 인해 세입자는 은행보다 후순위로 밀려 보증금을 회수하지 못하게 됩니다. 이를 방지하기 위해 계약 후 잔금 지급 다음날까지 근저당 설정 금지를 명시하거나, 전세권을 설정하는 것이 필요합니다.
`,
    "전세사기 유형별 예방법은 무엇인가요?": `
**1. 깡통전세**  
예방법: 평균 전세가율을 확인하여 전세가가 적정한지 검토합니다. 이를 통해 지나치게 높은 전세가율로 인한 위험을 줄일 수 있습니다.

**2. 이중계약**  
예방법: 임대차 계약을 반드시 집주인과 직접 체결하고, 등기부등본을 열람하여 소유주를 확인합니다. 이를 통해 이중계약으로 인한 피해를 예방할 수 있습니다.

**3. 불법 건축물 사기**  
예방법: 정부24 사이트에서 건축물 대장을 확인하여 건축물의 합법성을 검토합니다. 불법 건축물 여부를 확인함으로써 안전한 계약을 체결할 수 있습니다.

**4. 갭투자 사기**  
예방법: 전세보증금 반환보증을 가입하고 전세권 설정을 진행합니다. 또한, 부동산 시세의 75%에서 근저당액과 전세금을 뺀 값이 0 이상인지 확인해야 합니다.

**5. 신탁사기**  
예방법: 등기부등본의 갑구에 신탁 등기가 기재되어 있다면, 등기소에 방문하여 신탁원부를 확인해야 합니다. 그 후 대금지급자의 확인과 동의를 받았다면 거래를 진행합니다.

**6. 대항력 효력 발생 시점 악용 사기**  
예방법: 계약 후 전입신고 절차를 진행하는 동안, 대항력이 발생하는 시점 이전에 근저당 설정이 이루어지지 않도록 주의해야 합니다. 전세계약서에 “대항력 발생시점보다 이른 시점에 권리 사항이 추가될 경우 해당 계약을 무효로 한다”는 조건을 추가하여 보호받을 수 있도록 합니다.
`,
    "부동산이 경매에 넘어가면 보증금을 어떻게 받을 수 있나요?": `
만약 집주인이 파산 등 모종의 이유로 전세 보증금을 돌려주지 못하게 되면, 해당 부동산은 경매에 넘어갈 수 있습니다. 경매에 넘어간 부동산이 제3자에게 낙찰된다면, 해당 부동산을 구매한 제3자에게 보증금을 돌려받을 수 있습니다.

경매에 넘어간 부동산이 제3자에게 낙찰되지 않는다면, 경매는 유찰됩니다. 경매가 한 번 유찰될 때마다 최저 입찰가는 20~30% 정도 하락하게 됩니다. 따라서, 전세 계약을 맺을 때는 (매매가) x 70% > (전세보증금)인 집을 찾아야 합니다.
`,
    "근저당이 설정된 집에서는 보증금을 돌려받기 어려울 수 있는 이유는 무엇인가요?": `
집주인이 부동산을 매입할 당시, 또는 그보다 이전 시점에 은행으로부터 대출을 받게 되면, 해당 부동산에 대해 근저당이 설정됩니다. 이는 은행이 대출금을 담보하기 위해 부동산에 권리를 설정하는 것으로, 근저당 설정의 시점이 임차인과의 계약 체결보다 앞서게 되면, 임차인의 변제권보다 은행의 권리가 우선됩니다.

따라서, 근저당이 설정된 경우 임차인은 보증금을 온전히 돌려받지 못할 위험이 있습니다. 이러한 리스크를 줄이기 위해, 근저당이 있는 매물의 전세 계약을 체결할 시 매매가 x 70% > (전세보증금) + (근저당액)의 조건을 만족하는 집을 찾아야 합니다.
`,
    "전입신고를 하면 보증금에 어떤 법적 보호를 받게 되나요?": `
‘전입신고’는 주소를 변경한 경우, 해당 행정 구역의 관리자에게 본인의 주소 변경 사실을 알리는 행위입니다. 전입신고 시, ‘확정일자’와 ‘대항력’이 발생합니다.

‘확정일자’는 해당 주소에 언제부터 거주했는지를 공식적으로 등록하여 명시하는 절차입니다. 대항력은 주택을 사용할 권리와 보증금을 돌려받을 권리이며, 전입신고 다음 날 0시부터 발생합니다. 전입신고를 통해 대항력을 갖춰야만 전세 보증금에 대해 법적 보호를 받을 수 있습니다.
`,
    "우선 변제권이란 무엇인가요?": `
우선 변제권이란 부동산이 경매에서 낙찰될 때 임차인의 권리가 우선적으로 보호되는 권리입니다. 이 권리는 임차인이 전입신고를 하고 대항력 취득과 함께 확정일자를 받아야 발생합니다. 단, 확정일자가 근저당 설정보다 앞선 경우에만 우선 변제권이 적용됩니다.
`,
    "전세권 설정의 효력은 언제부터 발생하나요?": `
전세권 설정의 효력은 전세 계약이 체결된 즉시 발생합니다. 이는 확정일자나 우선변제권과 유사한 권리이지만, 익일 0시에 효력이 발휘되는 것과 달리, 전세 계약과 동시에 효력이 발휘된다는 점에서 차이가 있습니다.
`,
    "전세 보증 보험은 어떤 상황에서 보증금을 보호해주나요?": `
전세 보증 보험은 보험료를 납부한 세입자가 거주하는 부동산이 경매에 넘어갔을 때, 해당 보험 기관이 보장한도 내에서 전세보증금을 선지급해주는 제도입니다. 다만, 근저당이나 신탁 등 권리관계가 복잡한 경우에는 리스크가 높아져 보험 가입이 거절될 가능성이 있습니다.
`,
  };

  useEffect(() => {
    if (!isGreetingShown) {
      const initialMessage = "안녕하세요! 저는 전세닥터AI입니다. 전세 계약이 걱정되시나요? 전세 사기 예방부터 다양한 도움을 드릴 수 있어요. 전세와 관련해 궁금한 점이 있으시면 언제든지 편하게 물어보세요!";
      setCurrentTypingMessage(initialMessage);
      setIsGreetingShown(true);
    }
  }, [isGreetingShown]);

  useEffect(() => {
    if (currentTypingMessage) {
      let index = 0;
      const timer = setInterval(() => {
        if (index < currentTypingMessage.length) {
          setMessages(prev => {
            const newMessages = [...prev];
            if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'assistant') {
              newMessages[newMessages.length - 1].content = currentTypingMessage.slice(0, index + 1);
            } else {
              newMessages.push({ role: 'assistant', content: currentTypingMessage.slice(0, index + 1) });
            }
            return newMessages;
          });
          index++;
        } else {
          clearInterval(timer);
          setCurrentTypingMessage('');
          setIsLoading(false);
        }
      }, typingSpeed);

      return () => clearInterval(timer);
    }
  }, [currentTypingMessage]);

  useEffect(() => {
    if (isLoading) {
      const loadingTimer = setInterval(() => {
        setLoadingDots(prev => (prev.length < 3 ? prev + '.' : ''));
      }, 500);

      return () => clearInterval(loadingTimer);
    } else {
      setLoadingDots('');
    }
  }, [isLoading]);

  const handleFileChange = useCallback((event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const handleSendMessage = async (message) => {
    if (message.trim() === '') return;

    setMessages((prev) => [...prev, { role: 'user', content: message }]);
    setInput('');
    setIsLoading(true);
    setShowExamples(false);
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      const responseMessage = predefinedAnswers[message];
      if (responseMessage) {
        setCurrentTypingMessage(responseMessage);
      } else {
        const formData = new FormData();
        formData.append('message', message);
        if (file) {
          formData.append('file', file);
        }

        const res = await fetch('/api/chat', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (data.response) {
          setCurrentTypingMessage(data.response);
        } else {
          setCurrentTypingMessage('죄송합니다, 오류가 발생했습니다. 다시 시도해 주세요.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setCurrentTypingMessage('죄송합니다, 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setFile(null);
      setPreview(null);
    }
  };

  const handleTopicClick = (title) => {
    handleSendMessage(title);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage(input);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>챗봇</h1>
      </header>
      <div className={styles.chatContainer}>
        <div className={styles.chatMessages}>
          {messages.map((message, index) => (
            <div key={index} className={`${styles.message} ${message.role === 'user' ? styles.userMessage : styles.assistantMessage}`}>
              {message.role === 'assistant' && <span className={styles.assistantEmoji}>🤖</span>}
              <div className={styles.messageContent}>
                {message.role === 'user' ? (
                  message.content
                ) : (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className={styles.paragraph}>{children}</p>
                    }}
                  >
                    {message.content || loadingDots}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))}
          {messages.some(msg => msg.content.includes(predefinedAnswers["전세계약의 절차와 주의사항은 무엇인가요?"])) && (
            <div className={styles.imageContainer}>
              <Image src="/pictogram.png" alt="Pictogram 이미지" width={750} height={241} />
            </div>
          )}
        </div>
      </div>
      <div className={styles.inputWrapper}>
        {showExamples && (
          <>
            <h2 className={styles.sectionTitle}>기본사항</h2>
            <div className={styles.examplePromptsWrapper}>
              <div className={styles.examplePrompts}>
                {basicTopics.map((title, index) => (
                  <button key={index} onClick={() => handleTopicClick(title)} className={styles.examplePrompt}>
                    {title}
                  </button>
                ))}
              </div>
            </div>
            <h2 className={styles.sectionTitle}>많이 묻는 질문</h2>
            <div className={styles.examplePromptsWrapper}>
              <div className={styles.examplePrompts}>
                {examplePrompts.map((prompt, index) => (
                  <button key={index} onClick={() => handleSendMessage(prompt)} className={styles.examplePrompt}>
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
        <div className={styles.inputContainer}>
          <div className={styles.inputWrapperPill}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="무엇을 도와드릴까요?"
              className={styles.inputInsidePill}
            />
            <button
              onClick={() => handleSendMessage(input)}
              className={styles.sendButtonInsidePill}
              disabled={isLoading}
              aria-label="메시지 전송"
            >
              <SendIcon className={styles.sendIconInsidePill} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
