import './form.css'

export interface IFormData {
  type: string
  label?: string
  name: string
  value?: any
  options?: { label: string; value: string }[]
  placeholder?: string
  width?: number
  height?: number
  required?: boolean
  disabled?: boolean
}

export interface IFormOptions {
  data: IFormData[]
  blurHandler?: (event: Event) => void
}

export class Form {
  private container: HTMLDivElement
  private blurHandler?: (event: Event) => void
  constructor(selector: string, blurHandler?: (event: Event) => void) {
    this.blurHandler = blurHandler
    this.container = document.querySelector(selector)!
  }

  public setOptions(options: IFormOptions) {
    this.container.firstChild?.remove()
    const { data } = options
    const formContainer = document.createElement('div')
    formContainer.classList.add('form')
    this.container.append(formContainer)
    // 选项
    for (let i = 0; i < data.length; i++) {
      const option = data[i]
      const formItemContainer = document.createElement('div')
      formItemContainer.classList.add('form-item')
      // 选项名称
      if (option.label) {
        const optionName = document.createElement('span')
        if(option.type !== 'radio' && option.type !== 'checkbox') {
          optionName.append(document.createTextNode(option.label))
        }
        formItemContainer.append(optionName)
        if (option.required) {
          optionName.classList.add('form-item--require')
        }
      }
      formContainer.append(formItemContainer)

      if(option.type === 'span') {
        const span = document.createElement('span')
        span.append(document.createTextNode(option.value))
        formItemContainer.append(span)
        continue
      }

      // 选项输入框
      let optionInput:
        | HTMLInputElement
        | HTMLTextAreaElement
        | HTMLSelectElement
      if (option.type === 'select') {
        optionInput = document.createElement('select')
        option.options?.forEach(item => {
          const optionItem = document.createElement('option')
          optionItem.value = item.value
          optionItem.label = item.label
          optionInput.append(optionItem)
        })
      } else if (option.type === 'textarea') {
        optionInput = document.createElement('textarea')
      } else {
        optionInput = document.createElement('input')
        optionInput.type = option.type
      }
      if (option.width) {
        optionInput.style.width = `${option.width}px`
      }
      if (option.height) {
        optionInput.style.height = `${option.height}px`
      }
      optionInput.classList.add('form-item__input')
      optionInput.disabled = option.disabled || false
      optionInput.name = option.name
      if(option.value){
        if(option.type === 'radio' || option.type === 'checkbox') {
          if (optionInput instanceof HTMLInputElement) {
            optionInput.checked = option.value
          }
        }else{
          optionInput.value = option.value
        }
      }
      if (!(optionInput instanceof HTMLSelectElement)) {
        optionInput.placeholder = option.placeholder || ''
      }
      if(this.blurHandler) {
        optionInput.addEventListener('blur', this.blurHandler)
      }
      if(option.type === 'radio' || option.type === 'checkbox') {
        const label = document.createElement('label')
        label.style.display = 'contents'
        label.append(optionInput)
        const span = document.createElement('span')
        span.append(document.createTextNode(option.label!))
        label.append(span)
        formItemContainer.append(label)
      }else{
        formItemContainer.append(optionInput)
      }
    }
  }
}
